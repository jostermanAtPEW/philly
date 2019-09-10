/* global dataLayer */
import { Griffin } from '@Griffin';
import '../css/styles.scss';
import './image-gallery';
console.log(Griffin);
function GTMPush(eventLabel) {
    if (dataLayer) {
        dataLayer.push({ 'event': 'Interactive Click', 'eventData': eventLabel });
    }
}

const firstMainSection = 5;
const Philly = {
    init(){

        this.disableHoverOnTouch();
        var scrollTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                this.onScrollFinished();
            },50);
        });

       if ( window.navigator.userAgent.indexOf('iPhone') !== -1 && window.navigator.userAgent.indexOf('Safari') !== -1 && window.navigator.userAgent.indexOf('Chrome') === -1 && window.navigator.userAgent.indexOf('CriOS') === -1 && window.navigator.userAgent.indexOf('CriOS') === -1) {
            document.querySelector('body').classList.add('is-mobile-safari');
            this.isMobileSafari = true;
        }
       
        this.section = {
            allSections: document.querySelectorAll('.js-main-primary > section'),
            toolbar:    document.querySelector('.js-main-primary > section:nth-child(1)'), 
            heroImage:  document.querySelector('.js-main-primary > section:nth-child(2)'),
            title:      document.querySelector('.js-main-primary > section:nth-child(3)'),
            intro:      document.querySelector('.js-main-primary > section:nth-child(4)'),
            one:        document.querySelector('.js-main-primary > section:nth-child(5)'),
            miniNav:    document.querySelector('.mini-nav'),
            miniNavAll: document.querySelectorAll('.mini-nav > div')
        }
        this.caption = this.section.heroImage.querySelector('.image-block__meta-wrapper');      

      
        this.setInterSectionObserver();

        this.setNavEvents();

        Griffin.init({lazy: true});    

    },
    disableHoverOnTouch(){
    // HT: https://stackoverflow.com/a/30303898
        var hasHoverClass = false;
        var container = document.body;
        var lastTouchTime = 0;

        function enableHover() {
            // filter emulated events coming from touch events
            if (new Date() - lastTouchTime < 500) return;
            if (hasHoverClass) return;

            container.classList.add('has-hover');
            hasHoverClass = true;
        }

        function disableHover() {
            if (!hasHoverClass) return;
            container.classList.remove('has-hover');
            hasHoverClass = false;
        }

        function updateLastTouchTime() {
            lastTouchTime = new Date();
        }

        document.addEventListener('touchstart', updateLastTouchTime, true);
        document.addEventListener('touchstart', disableHover, true);
        document.addEventListener('mousemove', enableHover, true);

        enableHover();
    },
    onScrollFinished(){
        

        if (window.pageYOffset < 75 ){
            this.showIntroElements();
        }

        for ( var i = firstMainSection - 1; i < this.section.allSections.length; i++ ){ // firstMainSection is 1-mdexed for use in nth-child; substract 1 here so it's zero-indexed
            let rect = this.section.allSections[i].getBoundingClientRect();
            if ( i === ( firstMainSection - 1)  ){
                if ( rect.top < 103 ){
                    this.section.miniNav.classList.add('in-view');
                    this.section.toolbar.classList.add('in-view');
                } else {
                    this.section.miniNav.classList.remove('in-view');
                    this.section.toolbar.classList.remove('in-view');
                }
            }
            if ( rect.top > 0 - rect.height && rect.bottom > window.innerHeight / 2 ){
                this.section.miniNavAll.forEach(nav => {
                    nav.classList.remove('current-section');
                });
                if ( this.section.miniNavAll[i - ( firstMainSection - 1) ] !== undefined ){
                    this.section.miniNavAll[i - ( firstMainSection - 1) ].classList.add('current-section');
                }
                break;
            }
        }
        console.log(Griffin);
        function go(griffin, i){
            requestAnimationFrame(function(){
                console.log(griffin, i);
                Griffin.construct(griffin, i);
            });
        }
        Griffin.griffins.forEach(function(griffin, i){
            if (griffin.isPending){
                let rect = griffin.getBoundingClientRect();
                if ( (rect.top > 0 - rect.height / 3 && rect.top < window.innerHeight - rect.height / 3 ) || ( rect.top < 0 && rect.bottom > window.innerHeight )){
                    if (window.requestIdleCallback){
                        requestIdleCallback(function(){
                            go(griffin, i);
                        }, {timeout:500});
                    } else {
                        setTimeout(function(){
                            go(griffin, i);
                        });
                    }
                }
            }
        });
    },
    showIntroElements(){
        if ( this.titleElementsAreHidden ){
            this.section.title.style.transform = 'translateY(calc(-100% - 100px)) translateX(0)';
            this.caption.style.transform = 'translateX(0)';
            this.section.heroImage.querySelector('img').style.opacity = 1;
            this.titleElementsAreHidden = false;
        }
    },
    setInterSectionObserver(){
        function buildThresholdList() { // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
            var thresholds = [],
                numSteps = 50;

            for (var i = 1; i <= numSteps; i++) {
                var ratio = i / numSteps;
                thresholds.push(ratio);
            }
            thresholds.push(0);
            return thresholds;
        }

        function callback(entries){
            function hideElements(){
                if (!this.titleElementsAreHidden){
                    window.requestAnimationFrame(() => {
                        this.section.title.style.transform = 'translateY(calc(-100% - 100px)) translateX(-100%)';
                      this.caption.style.transform = 'translateX(100%)';
                    this.section.heroImage.querySelector('img').style.opacity = 0.2;
                        this.titleElementsAreHidden = true;
                    });
                }
            }
            entries.forEach(entry => {
                console.log(entry);
                if ( entry.boundingClientRect.top > 0 ){
                    if ( entry.intersectionRatio < 0.01 ) {
                        window.requestAnimationFrame(() => {
                            this.showIntroElements();
                        });
                    } else  {
                        hideElements.call(this);
                    }
                } else {
                    hideElements.call(this);
                } 
            });
        }
        //callback.bind(this);
        var options = {
            threshold: buildThresholdList()
        };
        var observer = new IntersectionObserver(callback.bind(this), options);
        observer.observe(this.section.intro);
    },
    setNavEvents(){
        function navClickHandler(i){
            var offset = document.querySelector('.global-header').offsetHeight + document.querySelector('.page-toolbar__wrapper').offsetHeight;
            document.querySelector('.js-main-primary > section:nth-child(' + ( i + firstMainSection ) + ')').scrollIntoView({block: 'start'});
            window.scrollBy(0,-offset);

        }   
        document.querySelectorAll('.grid-item.is-link').forEach((item, i) => {
            item.addEventListener('click', function(){
                navClickHandler.call(this, i);
                GTMPush('SOTC|Nav|Section-' + ( i + 1 ));
            });
        });
        var miniNav = document.querySelector('.mini-nav');
        miniNav.addEventListener('click', (e) => {
            e.stopPropagation();
            if ( !this.isMobileSafari ){
                return;
            }
            function closeMenu(){
                miniNav.classList.remove('mobile-safari-in-view');
                this.miniNavMobileSafariIsInView = false;
                document.body.removeEventListener('click', closeMenu);
            }
            if ( this.miniNavMobileSafariIsInView ){
                closeMenu.call(this);
            } else {
                miniNav.classList.add('mobile-safari-in-view');
                this.miniNavMobileSafariIsInView = true;
                document.body.addEventListener('click', closeMenu.bind(this));
            }
        });
        document.querySelectorAll('.mini-nav > div:not(.mini-nav--back-to-top)').forEach((item, i) => {
            item.addEventListener('click', function(){
                navClickHandler.call(this, i);
                GTMPush('SOTC|MiniNav|Section-' + ( i + 1 ));
            });
        });
        document.querySelector('.mini-nav--back-to-top').addEventListener('click', function(){
            document.querySelector('.js-main-primary > section:nth-child(1)').scrollIntoView({block: 'start'});
         //   this.showIntroElements();
            GTMPush('SOTC|MiniNav|Top');
        });
    },
};

if (window.requestIdleCallback){
    requestIdleCallback(Philly.init.bind(Philly), {timeout: 500});
} else {
    setTimeout(function(){
        Philly.init();
    });
}
import '../css/styles.scss';
import scrollMonitor from 'scrollmonitor';
//TODO: need smoothscroll polyfill
const firstMainSection = 4
const Philly = {
    init(){

        window.onbeforeunload = function () {
          window.scrollTo(0, 0);
        }
        this.section = {
            heroImage: document.querySelector('.js-main-primary section:first-child'),
            title: document.querySelector('.js-main-primary section:nth-child(2)'),
            intro: document.querySelector('.js-main-primary section:nth-child(3)'),
            one: document.querySelector('.js-main-primary section:nth-child(3)'),
            
            

        }
        this.setScrollMonitor();
        this.setIntroPadding();
        this.setNavEvents();

    },
    setNavEvents(){
        function navClickHandler(i){
            document.querySelectorAll('.js-main-primary > section').forEach(section => {
                section.style.display = 'block';
            });
            document.querySelector('.js-main-primary > section:nth-child(' + ( i + firstMainSection ) + ')').scrollIntoView({behavior: 'smooth', block: 'start'});

        }
        document.querySelectorAll('.grid-item.is-link').forEach((item, i) => {
            item.addEventListener('click', function(){
                navClickHandler.call(this, i);
            });
        });
    },
    setScrollMonitor(){
        function handleScroll(elem){
            if ( elem.isAboveViewport ) {
                console.log(elem);
                this.section.title.style.position = 'relative';
                this.section.title.style.top = '0px';
                elementWatcher.destroy();
            }
        }

        var elementWatcher = scrollMonitor.create(this.section.intro, {top: 61});
        elementWatcher.partiallyExitViewport(() => {
            handleScroll.call(this, elementWatcher);
        });elementWatcher.fullyEnterViewport(() => {
            handleScroll.call(this, elementWatcher)
        });
    },
    setIntroPadding(){
        var titleOffset = this.section.title.offsetHeight + 90;
        var negMargin = titleOffset - 392;
        console.log(titleOffset);
        this.section.intro.style.paddingTop = titleOffset + 'px';
        this.section.title.style.marginBottom = negMargin + 'px';

    }
};
Philly.init();
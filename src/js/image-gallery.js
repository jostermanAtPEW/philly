/* global $ */
//import 'slick-carousel/slick/slick';

    if (!$("body").hasClass("is-page-editor")) {
        let imageGalleryStore = [];
        let miniGalleryStore = [];
        let $imageGalleries = $(".image-gallery--bug-fix");
        let $miniGalleryBlueprint = $("<div>", {
            class: "image-gallery--bug-fix__mini-slider js-image-gallery--bug-fix-mini-slider"
        });

        let initImageGalleries = function () {
            $imageGalleries.each(function () {
                // Init a new Slick slider for each primary gallery
                $(this)
                    .clone()
                    .insertAfter($(this))
                    .addClass("is-full-screen gallery-is-hidden");
                // $imageGalleries.push(this);
            });
            let $clonedGalleries = $(".js-image-gallery--bug-fix");

            $clonedGalleries.each(function (index) {
                // Init a new Slick slider for each primary gallery
                imageGalleryStore[index] = $(this).slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                    fade: true,
                    prevArrow: $(this)
                        .closest(".image-gallery--bug-fix")
                        .find(".image-gallery--bug-fix__prev-arrow"),
                    nextArrow: $(this)
                        .closest(".image-gallery--bug-fix")
                        .find(".image-gallery--bug-fix__next-arrow")
                });

                // Build a mini gallery for each primary gallery
                miniGalleryStore[index] = buildMiniGallery(
                    $(this),
                    imageGalleryStore[index]
                );

                imageGalleryStore[index].on("beforeChange", function (
                    event,
                    slick,
                    currentSlide,
                    nextSlide
                ) {
                    $(this)
                        .closest(".image-gallery--bug-fix")
                        .find(".js-image-gallery--bug-fix-current-index")
                        .text(nextSlide + 1);
                    miniGalleryStore[index].slick("slickGoTo", nextSlide);
                    // // Update Mini Gallery too
                    $(".js-mini-slider-caption-wrap").text(
                        $(slick.$slides.get(nextSlide))
                            .find("figcaption")
                            .text()
                    );
                    $(".js-mini-slider-title-wrap").text(
                        $(slick.$slides.get(nextSlide))
                            .find(".image-block__title")
                            .text()
                    );

                    $(".js-mini-slider-credit-wrap").text(
                        $(slick.$slides.get(nextSlide))
                            .find(".image-block__photo-credit")
                            .text()
                    );
                    if (
                        $(slick.$slides.get(nextSlide)).find(".image-block__photo-credit")
                            .length > 0
                    ) {
                        $(".js-mini-slider-credit-wrap").addClass(
                            "mini-slider__image-has-credit"
                        );
                    } else {
                        $(".js-mini-slider-credit-wrap").removeClass(
                            "mini-slider__image-has-credit"
                        );
                    }

                    $(".js-mini-slider-copyright-wrap").text(
                        $(slick.$slides.get(nextSlide))
                            .find(".image-block__photo-copyright")
                            .text()
                    );
                    if (
                        $(slick.$slides.get(nextSlide)).find(
                            ".image-block__photo-copyright"
                        ).length > 0
                    ) {
                        $(".js-mini-slider-copyright-wrap").addClass(
                            "mini-slider__image-has-copyright"
                        );
                    } else {
                        $(".js-mini-slider-copyright-wrap").removeClass(
                            "mini-slider__image-has-copyright"
                        );
                    }
                });
            });

            // Size/position everything once on init
            resizeAndRepositionImageGallery();

            // Size/position everything every time the viewport resizes
            $(window).on("resize", function () {
                resizeAndRepositionImageGallery();
            });

            $(".js-launch-full-screen-gallery").on("click", function (e) {
                e.preventDefault();
                $(this)
                    .closest(".image-gallery--bug-fix")
                    .next(".is-full-screen")
                    .removeClass("gallery-is-hidden");
                setTimeout(resizeAndRepositionImageGallery, 200);
            });

            $(".js-image-gallery--bug-fix-leave-full-screen").on("click", function (e) {
                e.preventDefault();
                const $fullScreen = $(this).closest(".is-full-screen");
                $fullScreen.addClass("gallery-is-hidden");

                setTimeout(resizeAndRepositionImageGallery, 200);
                $fullScreen.prev(".image-gallery--bug-fix").find('.image-block__media')[0].scrollIntoView();
            });
        };

        //
        // Every image gallery will need its own mini slider
        //
        let buildMiniGallery = function ($gallery, $slider) {
            let $images = $gallery.find(".image-block__media");
            let $newGallery = $miniGalleryBlueprint.clone();

            $images.each(function (index) {
                $(this).find('picture img').addClass("xdbpe");
                $(this).find('picture img').attr('data-xdbpe', 'AA4F5A48-5554-4769-8378-DADCF2E947DD');
                let $imgSource = $(this)
                    .find("picture img")
                    .clone();
                /*let $imgTitle = $(this)
                    .find(".image-block__title")
                    .text();*/
                let $imgCaption = $(this)
                    .find("figcaption")
                    .text();
                let $wrappedImg = $("<div>", {
                    class: "image-gallery--bug-fix__mini-slider-img-wrapper"
                });

                $wrappedImg.append($imgSource);
                $wrappedImg.append(
                    '<div class="js-mini-slider-img-caption">' + $imgCaption + "</div>"
                );
                $newGallery.append($wrappedImg);

                $wrappedImg.on("click", function () {
                    $slider.slick("slickGoTo", index);
                });
            });

            $newGallery
                .appendTo(
                    $gallery
                        .closest(".image-gallery--bug-fix")
                        .find(".image-gallery--bug-fix__mini-slider-inner-wrapper")
                )
                .slick({
                    slidesToShow: 6,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                    prevArrow: $gallery
                        .closest(".image-gallery--bug-fix")
                        .find(".image-gallery--bug-fix__mini-prev-arrow"),
                    nextArrow: $gallery
                        .closest(".image-gallery--bug-fix")
                        .find(".image-gallery--bug-fix__mini-next-arrow")
                });

            $(".js-toggle-mini-slider-panel").unbind("click").on("click", function () {
                $(this).parent(".image-gallery--bug-fix__mini-slider-outer-wrapper").toggleClass("is-open");
            });

            return $newGallery;
        };

        //
        // When the viewport changes, the max height of Image Gallery images and
        // the prev/next arrow positions will need to be recalculated.
        //
        let resizeAndRepositionImageGallery = function () {
            $(imageGalleryStore).each(function (index, $gallery) {
                // Climb the tree up to this gallery's origin
                $gallery = $gallery.closest(".image-gallery--bug-fix");

                // Image Galleries should never be taller than a 16:9 aspect ratio, using the container width as the "16"
                let sliderImageHeight = Math.round($gallery.outerWidth() * (9 / 16));
                let sliderArrowHeight = 27;
                let isFullScreen = $gallery.hasClass("is-full-screen");

                imageGalleryStore[index].slick("refresh");
                miniGalleryStore[index].slick("refresh");
                // miniGalleryStore[index].slick('resize');

                if (isFullScreen) {
                    // Images never taller than the full gallery itself
                    $gallery.find(".image-block__media img").css({
                        maxHeight: $(window).outerHeight(),
                        maxWidth: $(window).outerWidth()
                        //maxHeight: '',
                        //maxWidth: ''
                    });

                    // Position next/prev arrows vertically centered based on image height
                    $gallery
                        .find(".image-gallery--bug-fix__next-arrow, .image-gallery--bug-fix__prev-arrow")
                        .css("top", ($(window).outerHeight() - sliderArrowHeight) / 2);

                    // Current slide index needs doesn't need fancy positioning
                    $gallery.find(".image-gallery--bug-fix__current-index").css("top", 0);

                    $(".image-gallery--bug-fix__mini-slider-img-wrapper").css({
                        height: 80
                    });
                } else {
                    // Images never taller than the full gallery itself
                    $gallery.find(".image-block__media img").css({
                        maxHeight: sliderImageHeight,
                        maxWidth: undefined
                    });

                    // Position next/prev arrows vertically centered based on image height
                    $gallery
                        .find(".image-gallery--bug-fix__next-arrow, .image-gallery--bug-fix__prev-arrow")
                        .css("top", (sliderImageHeight - sliderArrowHeight) / 2);

                    // Current slide index needs to sit just below the images
                    $gallery
                        .find(".image-gallery--bug-fix__current-index")
                        .css("top", sliderImageHeight + 15);

                    $(".image-gallery--bug-fix__mini-slider-img-wrapper").css({
                        height:
                            $(".image-gallery--bug-fix__mini-slider-img-wrapper").width() * 0.5625
                    });
                }

                //$gallery[0].scrollIntoView();
               // $("html")[0].scrollTop = $gallery.offset().top;
            });

            $(document).on("keydown", function (e) {
                let imageGallery = $(".image-gallery--bug-fix.is-full-screen .js-image-gallery--bug-fix");
                if (imageGallery) {
                    if (e.which === 27) {
                        $(".image-gallery--bug-fix").removeClass("is-full-screen");
                        setTimeout(resizeAndRepositionImageGallery, 200);
                    }
                    if (e.which === 37) {
                        imageGallery.slick("slickPrev");
                    }
                    if (e.which === 39) {
                        imageGallery.slick("slickNext");
                    }
                }
            });
        };

        initImageGalleries();
    }

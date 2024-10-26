import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Carousel styling

export default function HomeCarousel() {

    return (
        <div style={{position: 'relative', minHeight: '100vh'}}>


            <Carousel autoPlay infiniteLoop showThumbs={false}>
                <div>
                    <img src="/homepage-1.jpg" alt="Slide 1"/>
                </div>
                <div>
                    <img src="/test-1.jpg" alt="Slide 2"/>
                </div>
                <div>
                    <img src="/images/slide3.jpg" alt="Slide 3"/>
                </div>
            </Carousel>

        </div>
    );
}

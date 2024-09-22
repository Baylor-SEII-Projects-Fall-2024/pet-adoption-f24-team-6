// components/Carousel.js
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const ImageCarousel = () => {
    return (
        <Carousel autoPlay infiniteLoop showThumbs={false} >
            <div>
                <img src='/furever-homes-1.jpg' alt="Slide 1" />
                {/*hdsfk*/}
            </div>
            <div>
                <img src="/test-1.jpg" alt="Slide 2" />
            </div>
            <div>
                <img src="/images/slide3.jpg" alt="Slide 3" />
            </div>
        </Carousel>
    );
};

export default ImageCarousel;
import React from 'react';
import { Panel, Typography } from '@mycrypto/ui';
import Slider from 'react-slick';

import './TestimonialsPanel.scss';

interface TestimonialCardProps {
  text: string;
  author: string;
}

const TestimonialCard: React.SFC<TestimonialCardProps> = ({ text, author }) => {
  return (
    <div className="TestimonialsPanel-TestimonialCard">
      <Typography className="TestimonialsPanel-TestimonialCard-text">{text}</Typography>
      <Typography className="TestimonialsPanel-TestimonialCard-author">{author}</Typography>
    </div>
  );
};

const randomText =
  '“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.“';
const randomAuthor = 'Mary Myers';

export default function TestimonialsPanel() {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: true,
    swipe: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 820,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <Panel basic={true} className="TestimonialsPanel">
      <Slider {...settings}>
        <TestimonialCard text={randomText} author={randomAuthor + ' 1'} />
        <TestimonialCard text={randomText} author={randomAuthor + ' 2'} />
        <TestimonialCard text={randomText} author={randomAuthor + ' 3'} />
      </Slider>
    </Panel>
  );
}

import React from 'react';
import { Panel, Typography } from '@mycrypto/ui';
import Slider from 'react-slick';

import './TestimonialsPanel.scss';

interface TestimonialCardProps {
  text: string;
  author: string;
}

const TestimonialCard = ({ text, author }: TestimonialCardProps) => {
  return (
    <div className="TestimonialsPanel-TestimonialCard">
      <Typography className="TestimonialsPanel-TestimonialCard-text">{text}</Typography>
      <Typography className="TestimonialsPanel-TestimonialCard-author">{author}</Typography>
    </div>
  );
};

const text =
  '“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.“';
const author = 'Mary Myers';

export default function TestimonialsPanel() {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: false,
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
        <TestimonialCard text={text} author={author + ' 1'} />
        <TestimonialCard text={text} author={author + ' 2'} />
        <TestimonialCard text={text} author={author + ' 3'} />
      </Slider>
    </Panel>
  );
}

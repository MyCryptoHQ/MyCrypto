import React from 'react';
import { Panel } from '@mycrypto/ui';
import Slider from 'react-slick';
import styled from 'styled-components';

import './TestimonialsPanel.scss';
import { BREAK_POINTS } from 'v2/features/constants';

const { SCREEN_XS, SCREEN_SM, SCREEN_XXL } = BREAK_POINTS;

const MainPanel = styled(Panel)`
  padding: 148px 120px;
  max-width: ${SCREEN_XXL};
  width: 100%;
  @media (max-width: ${SCREEN_SM}) {
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 80px;
    padding-bottom: 80px;
  }
`;

const TestimonialCardWrapper = styled.div`
  padding-right: 40px;
  padding-left: 40px;
  max-width: 400px;
  margin: auto;

  @media (max-width: ${SCREEN_XS}) {
    height: auto;
  }
`;

const TestimonialCardText = styled.p`
  font-size: 21px;
  line-height: 1.4;
  font-weight: normal;
`;

const TestimonialCardAuthor = styled.p`
  font-size: 26px;
  font-weight: bold;
  line-height: 1.5;
  margin-top: 31px;
`;

interface TestimonialCardProps {
  text: string;
  author: string;
}

const TestimonialCard: React.SFC<TestimonialCardProps> = ({ text, author }) => {
  return (
    <TestimonialCardWrapper>
      <TestimonialCardText>{text}</TestimonialCardText>
      <TestimonialCardAuthor>{author}</TestimonialCardAuthor>
    </TestimonialCardWrapper>
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
    <MainPanel basic={true} className="TestimonialsPanel">
      <Slider {...settings}>
        <TestimonialCard text={randomText} author={randomAuthor + ' 1'} />
        <TestimonialCard text={randomText} author={randomAuthor + ' 2'} />
        <TestimonialCard text={randomText} author={randomAuthor + ' 3'} />
      </Slider>
    </MainPanel>
  );
}

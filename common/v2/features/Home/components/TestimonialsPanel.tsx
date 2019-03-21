import React from 'react';
import { Panel } from '@mycrypto/ui';
import Slider from 'react-slick';
import styled from 'styled-components';

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

  .slick-slider {
    width: 100%;

    .slick-disabled {
      display: none !important;
    }

    .slick-prev {
      z-index: 9999;
      left: 0px;
      background: url(/common/assets/images/icn-more.svg) top left;
      background-size: cover;
      background-repeat: no-repeat;
      transform: translate(0, -50%) rotate(180deg);

      @media (min-width: ${SCREEN_XS}) and (max-width: ${SCREEN_SM}) {
        left: calc(50% - 250px);
      }

      @media (max-width: ${SCREEN_XS}) {
        left: 5px;
      }
    }

    .slick-next {
      right: 0px;
      background: url(/common/assets/images/icn-more.svg) top left;
      background-size: cover;
      background-repeat: no-repeat;

      @media (min-width: ${SCREEN_XS}) and (max-width: ${SCREEN_SM}) {
        left: calc(50% + 200px);
      }

      @media (max-width: ${SCREEN_XS}) {
        right: 5px;
      }
    }

    button {
      width: 24px;
      height: 24px;

      &:before {
        opacity: 1;
        content: '';
      }
    }
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
    <MainPanel basic={true}>
      <Slider {...settings}>
        <TestimonialCard text={randomText} author={randomAuthor + ' 1'} />
        <TestimonialCard text={randomText} author={randomAuthor + ' 2'} />
        <TestimonialCard text={randomText} author={randomAuthor + ' 3'} />
      </Slider>
    </MainPanel>
  );
}

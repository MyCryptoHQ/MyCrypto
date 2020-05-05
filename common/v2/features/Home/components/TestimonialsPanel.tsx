import React from 'react';
import { Panel } from '@mycrypto/ui';
import Slider from 'react-slick';
import styled from 'styled-components';

import { translateRaw } from 'v2/translations';
import { BREAK_POINTS, COLORS } from 'v2/theme';

import './SliderImports.scss';

import sparkles1Icon from 'common/assets/images/icn-sparkles-1.svg';
import sparkles2Icon from 'common/assets/images/icn-sparkles-2.svg';
import sparkles3Icon from 'common/assets/images/icn-sparkles-3.svg';
import moreIcon from 'common/assets/images/icn-more.svg';

const { SCREEN_XS, SCREEN_SM, SCREEN_XXL } = BREAK_POINTS;
const { GREYISH_BROWN } = COLORS;

const MainPanel = styled(Panel)`
  padding: 98px 120px 93px 120px;
  max-width: ${SCREEN_XXL};
  width: 100%;
  @media (max-width: ${SCREEN_SM}) {
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 30px;
    padding-bottom: 20px;
  }

  .slick-slider {
    width: 100%;

    .slick-disabled {
      display: none !important;
    }

    .slick-prev {
      z-index: 9999;
      left: 0px;
      background: url(${moreIcon}) top left;
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
      background: url(${moreIcon}) top left;
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
  padding-right: 50px;
  padding-left: 50px;
  padding-top: 50px;
  max-width: 420px;
  margin: auto;
  color: ${GREYISH_BROWN};

  @media (max-width: ${SCREEN_XS}) {
    height: auto;
  }
`;

const TestimonialCardTextWrapper = styled.div`
  position: relative;
`;

const TestimonialCardText = styled.p`
  font-size: 21px;
  line-height: 1.4;
  font-weight: normal;

  @media (max-width: ${SCREEN_XS}) {
    font-size: 16px;
  }
`;

const TestimonialCardAuthor = styled.p`
  font-size: 30px;
  font-weight: bold;
  line-height: 45px;
  margin-top: 31px;
  margin-bottom: 35px;
  display: inline-block;
  position: relative;

  @media (max-width: ${SCREEN_XS}) {
    font-size: 20px;
  }
`;

const Sparkles1 = styled.img`
  width: 82px;
  height: 78px;
  position: absolute;
  top: -45px;
  left: -55px;
`;

const Sparkles2 = styled.img`
  width: 57px;
  height: 67px;
  position: absolute;
  top: 10px;
  right: -55px;
`;

const Sparkles3 = styled.img`
  width: 41px;
  height: 39px;
  position: absolute;
  bottom: -30px;
  right: -15px;
`;

interface TestimonialCardProps {
  text: string;
  author: string;
  sparkles: JSX.Element;
  sparklesPosition: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  text,
  author,
  sparkles,
  sparklesPosition
}) => {
  return (
    <TestimonialCardWrapper>
      <TestimonialCardTextWrapper>
        {sparklesPosition === 'top' && sparkles}
        <TestimonialCardText>{text}</TestimonialCardText>
        {sparklesPosition === 'middle' && sparkles}
      </TestimonialCardTextWrapper>
      <TestimonialCardAuthor>
        {author}
        {sparklesPosition === 'bottom' && sparkles}
      </TestimonialCardAuthor>
    </TestimonialCardWrapper>
  );
};

const testimonials = [
  {
    author: 'AtLeastSignificant',
    text: translateRaw('TESTIMONIAL_AT_LEAST_SIGNIFICANT')
  },
  {
    author: 'Nick Johnson',
    text: translateRaw('TESTIMONIAL_NICK_JOHNSON')
  },
  {
    author: 'Raymond Durk',
    text: translateRaw('TESTIMONIAL_RAYMOND_DURK')
  },
  {
    author: 'Andrew Coathup',
    text: translateRaw('TESTIMONIAL_ANDREW_COATHUP')
  },
  {
    author: 'James Ryan Moreau',
    text: translateRaw('TESTIMONIAL_JAMES_RYAN_MOREAU')
  },
  {
    author: 'Tim Coulter',
    text: translateRaw('TESTIMONIAL_TIM_COULTER')
  }
];

const sparkleComponents = [
  <Sparkles1 key={0} src={sparkles1Icon} />,
  <Sparkles2 key={1} src={sparkles2Icon} />,
  <Sparkles3 key={2} src={sparkles3Icon} />
];
const sparklesPositions = ['top', 'bottom', 'middle'];

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
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            text={`"${testimonial.text}"`}
            author={`-${testimonial.author}`}
            sparkles={sparkleComponents[index % 3]}
            sparklesPosition={sparklesPositions[index % 3]}
          />
        ))}
      </Slider>
    </MainPanel>
  );
}

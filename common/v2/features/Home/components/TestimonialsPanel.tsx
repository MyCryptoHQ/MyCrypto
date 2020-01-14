import React from 'react';
import { Panel } from '@mycrypto/ui';
import Slider from 'react-slick';
import styled from 'styled-components';

import { BREAK_POINTS, COLORS } from 'v2/theme';
import './SliderImports.scss';

import sparkles1Icon from 'common/assets/images/icn-sparkles-1.svg';
import sparkles2Icon from 'common/assets/images/icn-sparkles-2.svg';
import sparkles3Icon from 'common/assets/images/icn-sparkles-3.svg';

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

const TestimonialCard: React.SFC<TestimonialCardProps> = ({
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
    text:
      'MyCrypto is the definition of a successful grass-roots movement for the community, by the community.'
  },
  {
    author: 'Nick Johnson',
    text:
      'MyCrypto provides some of the best and most carefully thought-through tools available in the Ethereum community.'
  },
  {
    author: 'Raymond Durk',
    text:
      'MyCrypto has consistently released the perfect balance between personal security, user experience, and new features.'
  },
  {
    author: 'Andrew Coathup',
    text:
      'I love the MyCrypto team, with their focus on education and security for the entire community.  Friendly, responsive, passionate and generous.'
  },
  {
    author: 'James Ryan Moreau',
    text:
      'MyCrypto is one of the most responsive teams in the entire blockchain space when it comes to thinking about users and their general well-being.'
  },
  {
    author: 'Tim Coulter',
    text:
      'MyCrypto is the leader in blockchain wallets. Their watchful eye on security and their close proximity to users put them on the front lines, shepherding users through the new and exciting world of crypto.'
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

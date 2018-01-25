import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { HardwareWallets, Coinbase, Bity } from './PromoComponents';
import './Promos.scss';

const promos = [HardwareWallets, Coinbase, Bity];

const CarouselAnimation = ({ children, ...props }) => (
  <CSSTransition {...props} timeout={300} classNames="carousel">
    {children}
  </CSSTransition>
);

interface State {
  activePromo: number;
}

export default class Promos extends React.PureComponent<{}, State> {
  public timer: any = null;

  public state = {
    activePromo: parseInt(String(Math.random() * promos.length), 10)
  };

  public componentDidMount() {
    this.timer = setInterval(() => this.rotate(), 10000);
  }

  public componentWillUnmount() {
    clearInterval(this.timer);
  }

  public render() {
    const { activePromo } = this.state;

    return (
      <div className="Promos">
        <TransitionGroup className="Promos-promo-wrapper">
          {promos
            .filter(i => {
              return i === promos[activePromo];
            })
            .map(promo => <CarouselAnimation key={Math.random()}>{promo}</CarouselAnimation>)}
        </TransitionGroup>
        <div className="Promos-nav">
          {promos.map((_, index) => {
            return (
              <button
                className={`Promos-nav-btn ${index === activePromo ? 'is-active' : ''}`}
                key={index}
                onClick={this.navigateToPromo(index)}
              />
            );
          })}
        </div>
      </div>
    );
  }

  private navigateToPromo = (idx: number) => () => {
    // stop rotating when user begins interacting with promos
    clearInterval(this.timer);
    this.setState({ activePromo: Math.max(0, Math.min(promos.length, idx)) });
  };

  private rotate = () => {
    const activePromo = (this.state.activePromo + 1) % promos.length;
    this.setState({ activePromo });
  };
}

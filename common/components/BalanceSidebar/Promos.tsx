import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { HardwareWallets, Coinbase, Shapeshift, Simplex } from './PromoComponents';
import './Promos.scss';
import { connect } from 'react-redux';
import { AppState } from '../../reducers';

const CarouselAnimation = ({ children, ...props }: any) => (
  <CSSTransition {...props} timeout={300} classNames="carousel">
    {children}
  </CSSTransition>
);

// Don't change Coinbase index
const promos = [HardwareWallets, Coinbase, Shapeshift];
const isEuroLocal = () => {
  // getTimezoneOffset returns the difference in minutes between UTC and local time.
  // the offset is positive if behind UTC (like UTC-4), and negative if above (like UTC+2)
  const offset = new Date().getTimezoneOffset();
  // -240 to 0 covers UTC+4 to UTC+0, which is all of europe
  return -240 <= offset && offset < 0;
};
if (isEuroLocal()) {
  promos.push(Simplex);
}

interface State {
  activePromo: number;
}

interface StateProps {
  wallet: AppState['wallet']['inst'];
}

class PromosClass extends React.PureComponent<StateProps, State> {
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

  public getPromo() {
    const { activePromo } = this.state;
    const { wallet } = this.props;
    if (activePromo === 1) {
      if (wallet) {
        return <Coinbase address={wallet.getAddressString()} />;
      } else {
        return <Shapeshift />;
      }
    } else {
      return promos[activePromo];
    }
  }

  public render() {
    const { activePromo } = this.state;

    return (
      <div className="Promos">
        <TransitionGroup className="Promos-promo-wrapper">
          <CarouselAnimation key={Math.random()}>{this.getPromo()}</CarouselAnimation>
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

function mapStateToProps(state: AppState): StateProps {
  return {
    wallet: state.wallet.inst
  };
}

export default connect(mapStateToProps, {})(PromosClass);

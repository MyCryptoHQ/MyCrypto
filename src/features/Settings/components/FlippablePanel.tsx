import { Component } from 'react';

interface RenderProps {
  flipped: boolean;
  toggleFlipped(): void;
}

interface Props {
  children(props: RenderProps): any;
}

interface State {
  flipped: boolean;
}

export default class FlippablePanel extends Component<Props> {
  public state: State = {
    flipped: false
  };

  public render() {
    const { children } = this.props;
    const { flipped } = this.state;

    return children({
      flipped,
      toggleFlipped: this.toggleFlipped
    });
  }

  private toggleFlipped = () =>
    this.setState((prevState: State) => ({
      flipped: !prevState.flipped
    }));
}

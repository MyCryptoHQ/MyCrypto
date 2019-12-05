import React, { Component } from 'react';
import styled from 'styled-components';
import { Address } from '@mycrypto/ui';
import { truncate } from 'v2/utils';
import { get3BoxProfile, ThreeBoxProfile } from 'v2/services';

const AvatarImage = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
`;

interface Props {
  address: string;
  label?: string;
}

interface State {
  profile: ThreeBoxProfile;
}

export default class Profile extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      profile: false
    };
  }

  public componentDidMount() {
    const { address } = this.props;
    get3BoxProfile(address).then(result => {
      this.setState({
        profile: result
      });
    });
  }

  public render() {
    const { address, label } = this.props;
    const { profile } = this.state;
    if (!profile) {
      return <Address address={address} title={label} truncate={truncate} />;
    } else {
      return (
        <Address
          address={address}
          title={label}
          truncate={truncate}
          tooltip={{
            content: (
              <div>
                <Avatar>
                  <AvatarImage src={profile.image} />
                </Avatar>
                <p>{profile.name}</p>
                {profile.location && <p>Location: {profile.location}</p>}
                <a href={`https://3box.io/${address}`}>View on 3box</a>
              </div>
            )
          }}
        />
      );
    }
  }
}

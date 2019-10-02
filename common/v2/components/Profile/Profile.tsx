/* tslint:disable:no-console */
import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Address } from '@mycrypto/ui';
import { truncate } from 'v2/utils';

/* 
Example 3box addresses:

- 0x6b44862103b8a45f5ec701b69ec28a5d6d304950
- 0xbaebb7d18f8b16b0a970fda91f1efa626d67423e

*/

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
  has3Box: boolean;
  name?: string;
  image?: string;
  location?: string;
}

export default class Profile extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      has3Box: false
    };
  }

  public componentDidMount() {
    const { address } = this.props;
    axios
      .get(`https://ipfs.3box.io/profile?address=${address}`, {
        validateStatus: () => true
      })
      .then(result => {
        const { data, status } = result;
        if (status === 200) {
          console.log(data);
          this.setState({
            has3Box: true,
            name: data.name,
            image: data.image[0].contentUrl['/'],
            location: data.location
          });
        }
      });
  }

  public render() {
    const { address, label } = this.props;
    const { has3Box, name, image, location } = this.state;
    if (!has3Box) {
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
                  <AvatarImage src={`https://ipfs.io/ipfs/${image}`} />
                </Avatar>
                <p>{name}</p>
                {location && <p>Location: {location}</p>}
                <a href={`https://3box.io/${address}`}>View on 3box</a>
              </div>
            )
          }}
        />
      );
    }
  }
}

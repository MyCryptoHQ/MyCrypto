import React, { Component } from 'react';
import { VERSION } from 'config';

import './Banner.scss';

interface BannerState {
    displayBanner: boolean;
}

interface BannerProps {
    versionNow: string;
}

const StorageName = "ElectronBuildVerified";

export default class ElectronBuildVerified extends Component<BannerProps, BannerState> {
    public state: State = {
        displayBanner: this.isBannerPrompted()
    };

    constructor(props: BannerProps) {
        super(props);
    }

    public render() {
        const { displayBanner } = this.state;
        return(
            <>
            {
                displayBanner
                ?
                    (<div className="BannerContainer">
                        <input
                            type="checkbox"
                            onChange={(e) => this.CheckedBox(e)}
                        />{' '}
                        <p>
                            I have{' '}
                            <a href="https://support.mycrypto.com/staying-safe/verifying-authenticity-of-desktop-app">verified that this build ({VERSION})</a>{' '}
                            is signed by MyCrypto and I understand the risks of not verifying the build.
                        </p>
                    </div>)
                :
                    (<></>)
            }
            </>
        )
    }

    componentWillMount() {
        this.setState({ displayBanner: this.isBannerPrompted() })
    }

    private isBannerPrompted() {
        let storageVerified;
        if(localStorage.getItem(StorageName) !== null) {
            try {
                storageVerified = localStorage.getItem(StorageName);
                const objStorage = JSON.parse(storageVerified);
                if(objStorage.versionChecked === this.props.versionNow) {
                    return false;
                }
            } catch {
                //
            }
        } 

        return true;
    }

    private CheckedBox = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.checked) {
            this.setState({ displayBanner: false })
            localStorage.setItem(StorageName, JSON.stringify({"versionChecked": this.props.versionNow, "ack": true, "ts": Math.floor(Date.now() / 1000)}))
        }
    }
}
import React, { Component, useContext } from 'react';
import { CLIENT } from './ApolloClient';
import { gql } from "apollo-boost";
import { bool } from 'v2/services/EthService/ens/contracts/auction/auction';
import { Heading, Table } from '@mycrypto/ui';

const QUERY_GET_ENS_DOMAINS = gql`
{
    domains(where:{owner: "0x11b6a5fe2906f3354145613db0d99ceb51f604c9"}) {
        id
        name
        labelName
        labelhash
        isMigrated
        owner {
            id
        }
        parent {
            labelName
        }
    }
}          
`

type TTheGraphEns = {
    data: TDomain;
    loading: bool;
    networkStatus: number;
    stale: bool;
}

type TDomain = {
    id: string;
    isMigrated: bool;
    labelName: string;
    labelhash: string;
    name: string;
    parent: TDomainParent;
}

type TDomainParent = {
    labelName: string;
}

type TUserDomains = {
    owner: string;
    domain: string;
    expire: string;
}

type State = {
    fetched: bool;
    ensDomains: null | TTheGraphEns;
}

export default class Dashboard extends Component<{}, State> {

    public componentWillMount() {
        this.setState({
            fetched: false,
            ensDomains: null
        })
    }

    public async componentDidMount() {
        const data = await this.getData();
        this.setState({fetched: true, ensDomains: data})
    }

    public render() {

        if(this.state.fetched) {
            const tableData = this.buildEnsTable();
            const isTableReady = tableData ? true : false;
            return(<div>
                <Heading as="h2">Your ENS Domains</Heading>

                <p>Showing you the ENS domains you own (not showing subdomans) so you know when they expire</p>

                { isTableReady && 
                    <Table
                        head={[
                            'Owner Address',
                            'Domain Name',
                            'Expire Date'
                        ]}
                        body={tableData[0]}
                        config={{
                            sortableColumn: 'Expire Date'
                        }}
                    />
                }
            </div>)
        } 

        return(<div>
            <Heading as="h2">Your ENS Domains</Heading></div>)
    }

private buildEnsTable() {
    const domains = this.state.ensDomains.data.domains;

    // Get the top level domains they own
    const topLevelDomains = domains.filter(domain => domain.name === [domain.labelName,domain.parent.labelName].join('.'));

    return [
        topLevelDomains.map((domain) => {
            return [`${domain.owner.id}`, `${domain.name}`, "1970-01-01"]
        })
    ];
}

  private getData():any {
    const data = CLIENT.query({query: QUERY_GET_ENS_DOMAINS})
    return data;
  }
}
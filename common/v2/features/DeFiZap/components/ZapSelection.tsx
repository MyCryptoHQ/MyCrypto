import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { Button, ContentPanel } from 'v2/components';
import { ROUTE_PATHS } from 'v2/config';
import { COLORS, BREAK_POINTS } from 'v2/theme';

import { ZAPS_CONFIG, IZapId } from '../config';
import { DetailsList } from '.';
import sEth from 'assets/images/defizap/illustrations/seth.svg';

const FullSizedContentPanel = styled(ContentPanel)`
  padding: 0px;
`;

const ContentPanelHeading = styled.p`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 0.75em 1.1em 0em 1.1em;
  color: #303030;
  font-size: 32px;
  font-weight: bold;
`;

const SSection = styled.section`
  padding: 1.5em 2.25em;
  flex-direction: column;
  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    flex-direction: row;
  }
`;

const WhiteSection = styled(SSection)`
  background-color: ${COLORS.WHITE};
`;

const GreySection = styled(SSection)`
  background-color: ${COLORS.GREY_LIGHTEST};
`;

const DetailsSection = styled(WhiteSection)`
  display: flex;
  flex: 1;
`;
const ZapImageExplainer = styled.img``;

const ZapTextExplainer = styled.div`
  align-items: left;
  text-align: left;
  /* width: 50%; */
  flex: 1;
`;

const defaultZap = 'unipoolseth';

const ZapEducation = withRouter(({ history, location }) => {
  const qs = queryString.parse(location.search);
  const detectedZapId: IZapId = qs.key;
  const [zapSelected, setZapSelected] = useState(
    qs.key ? ZAPS_CONFIG[detectedZapId] || ZAPS_CONFIG[defaultZap] : ZAPS_CONFIG[defaultZap]
  );

  const handleSubmit = () => {
    if (!zapSelected) return;
    history.push(`${ROUTE_PATHS.DEFIZAP.path}/${zapSelected.key}`);
  };

  useEffect(() => {
    if (detectedZapId && ZAPS_CONFIG[detectedZapId] !== zapSelected && ZAPS_CONFIG[detectedZapId]) {
      setZapSelected(ZAPS_CONFIG[detectedZapId]);
    } else if (!detectedZapId || !ZAPS_CONFIG[detectedZapId]) {
      setZapSelected(ZAPS_CONFIG[defaultZap]);
    }
  }, [qs]);

  // Changes to new ZapSelection page with zap.
  // const handleZapSelected = (option: any) => {
  //   history.push(`${ROUTE_PATHS.DEFIZAP.path}/zap?key=${option.key}`);
  // };

  return (
    <FullSizedContentPanel>
      <ContentPanelHeading>{`${zapSelected.title} Details`}</ContentPanelHeading>
      <DetailsSection>
        <ZapImageExplainer src={sEth} />

        <ZapTextExplainer>
          <DetailsList onSubmit={handleSubmit} zapSelected={zapSelected} />
        </ZapTextExplainer>
      </DetailsSection>
      <GreySection>meh2</GreySection>
      <WhiteSection>meh3</WhiteSection>
      <GreySection>meh4</GreySection>
      This will eventually be the education panel for defizap, and the selection of zap for the rest
      of the flow. For now, it's just a dropdown to allow for us to test the rest of the flow.
      <br />
      <div>
        <Button onClick={handleSubmit}>Continue on!</Button>
      </div>
    </FullSizedContentPanel>
  );
});

export default ZapEducation;

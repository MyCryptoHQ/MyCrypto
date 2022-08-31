import { Text } from '@components/NewTypography';
import { getClaims, useSelector } from '@store';
import { translateRaw } from '@translations';
import { ClaimState, ClaimType } from '@types';

export const ClaimSubHead = ({ type }: { type: ClaimType }) => {
  const claims = useSelector(getClaims(type));

  const relevantAccounts = claims.filter((a) => a.state === ClaimState.UNCLAIMED);
  return (
    <Text mb={0} color="GREY">
      {translateRaw(
        relevantAccounts.length > 1 ? 'UNI_CLAIM_SUBHEAD_PLURAL' : 'UNI_CLAIM_SUBHEAD',
        {
          $total: relevantAccounts.length.toString()
        }
      )}
    </Text>
  );
};

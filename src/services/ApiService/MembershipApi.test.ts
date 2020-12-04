import { IMembershipId } from '@features/PurchaseMembership/config';
import { accountWithMembership, membershipApiResponse } from '@fixtures';
import { bigify } from '@utils';

import { formatResponse } from './MembershipApi';

describe('MembershipApi', () => {
  it('formatResponse(): transforms timestamps to MembershipStatus', () => {
    const expected = [
      {
        address: accountWithMembership,
        memberships: [
          { expiry: bigify('1590743978'), type: 'onemonth' as IMembershipId },
          { expiry: bigify('1609372800'), type: 'lifetime' as IMembershipId }
        ]
      }
    ];
    const actual = formatResponse(membershipApiResponse);
    expect(actual).toEqual(expected);
  });
});

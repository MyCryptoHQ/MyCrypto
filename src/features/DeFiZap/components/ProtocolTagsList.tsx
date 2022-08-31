import { TagsList } from '@components';

import { getPlatformColor } from '../helpers';

interface Props {
  platformsUsed: string[];
}

const ProtocolTagsList = ({ platformsUsed }: Props) => {
  const platformTags = platformsUsed.map((platform) => ({
    tagText: platform.toUpperCase(),
    color: getPlatformColor(platform)
  }));
  return <TagsList tags={platformTags} />;
};

export default ProtocolTagsList;

import styled from 'styled-components';

import { COLORS, SPACING } from '@theme';

const TagContainer = styled.ul`
  margin-bottom: 0px;
  padding: 0px;
  & li {
    &:not(:last-of-type) {
      margin-right: ${SPACING.XS};
    }
  }
`;

const TagItem = styled.li`
  display: inline-block;
  text-align: center;
  background: ${({ color = COLORS.GREY_LIGHT }) => color};
  border-radius: 600px;
  color: ${COLORS.WHITE};
  font-size: 0.8em;
  font-weight: normal;
  padding: 3px 6px;
`;

export interface ITag {
  tagText: string;
  color?: string;
}
interface Props {
  tags: ITag[];
}

const TagsList = ({ tags }: Props) => (
  <TagContainer>
    {tags.map(({ tagText, color }) => (
      <TagItem key={tagText} color={color}>
        {tagText}
      </TagItem>
    ))}
  </TagContainer>
);

export default TagsList;

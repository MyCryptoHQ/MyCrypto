import { Box, Icon, LinkApp, Text, TIcon } from '@components';
import { COLORS, SPACING } from '@theme';
import { translateRaw } from '@translations';

export const TopItem = ({
  left = false,
  icon,
  title,
  current,
  onClick,
  color,
  href,
  isExternal = false
}: {
  left?: boolean;
  icon: TIcon;
  title: string;
  color: string;
  current?: boolean;
  onClick?(): void;
  href?: string;
  isExternal?: boolean;
}) => {
  const currentColor = current ? COLORS.BLUE_BRIGHT : color;
  return (
    <Box
      zIndex={999}
      mr={{ _: left ? 'auto' : SPACING.MD, sm: SPACING.MD }}
      style={{
        cursor: 'pointer',
        transform: current ? 'scale(1.1)' : 'unset',
        transition: 'all 300ms ease'
      }}
    >
      <LinkApp
        isExternal={isExternal}
        href={href ? href : '#'}
        color={color}
        onClick={onClick}
        variant={'barren'}
      >
        <Box variant="columnCenter">
          <Icon type={icon} height="24px" color={currentColor} />
          <Text
            mt={SPACING.XS}
            color={currentColor}
            textTransform="uppercase"
            fontSize={5}
            fontWeight={current ? 'bold' : 700}
            mb={0}
          >
            {translateRaw(title)}
          </Text>
        </Box>
      </LinkApp>
    </Box>
  );
};

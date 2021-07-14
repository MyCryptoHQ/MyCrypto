import { Box, Spinner, Text } from '@components';
import { translateRaw } from '@translations';

const AppLoading = () => {
  return (
    <Box variant="columnCenter" flex="1">
      <Box variant="rowCenter" mb={'1em'}>
        <Spinner color="brand" size={2} />
      </Box>
      <Text isDiscrete={true}>{translateRaw('APP_LOADING')}</Text>
    </Box>
  );
};

export default AppLoading;

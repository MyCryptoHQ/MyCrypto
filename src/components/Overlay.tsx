import styled, { css } from 'styled-components';

interface SProps {
  center?: boolean;
  absolute?: boolean;
  show?: boolean;
}
const SOverlay = styled.div`
  ${(props: SProps) =>
    props.absolute
      ? css`
          position: absolute;
          top: 0;
          right: 0;
          height: 100%;
          width: 100%;
        `
      : css`
          position: fixed;
          width: 100vw;
          height: 100vh;
          top: 81px;
          right: 0;
          @media (min-width: 1000px) {
            top: 123px;
          }
        `}
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.65);
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  ${(props: SProps) =>
    props.center &&
    css`
      display: flex;
      align-items: center;
      justify-content: center;
    `}
`;
interface Props extends SProps {
  children?: any;
  onClick?(): void;
}
/*
  To use an absolute overlay that covers it's parent you must set the parent to
  position: relative.
*/
export default function Overlay({
  onClick,
  absolute = false,
  center = false,
  show = false,
  children
}: Props) {
  return (
    <SOverlay show={show} absolute={absolute} onClick={onClick} center={center}>
      {children}
    </SOverlay>
  );
}

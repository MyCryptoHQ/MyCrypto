// @flow

import React from "react";
import { toDataUrl } from "ethereum-blockies";
import { isValidETHAddress } from "libs/validators";

type Props = {
  address: string,
  // FIXME move to styled img tag everywhere
  forPrinting?: boolean
};

export default function Identicon(props: Props) {
  const identiconDataUrl = toDataUrl(props.address.toLowerCase()) || "";
  // FIXME breaks on failed checksums
  const style = !isValidETHAddress(props.address)
    ? {}
    : { backgroundImage: `url(${identiconDataUrl})` };
  if (props.forPrinting) {
    return (
      <img src={identiconDataUrl} style={{ width: "100%", height: "100%" }} />
    );
  }
  return (
    <div
      className="addressIdenticon"
      style={style}
      title="Address Indenticon"
    />
  );
}

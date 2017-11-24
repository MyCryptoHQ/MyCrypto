import React from 'react';

interface Props {
  message?: {
    to: string;
    msg: string;
  };
}

export const CustomMessage = (props: Props) => {
  return (
    <div className="clearfix form-group">
      {!!props.message && (
        <div className="alert alert-info col-xs-12 clearfix">
          <p>
            <small>A message from {props.message.to}</small>
          </p>
          <p>
            <strong>{props.message.msg}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

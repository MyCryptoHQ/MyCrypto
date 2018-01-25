import React, { Component } from 'react';
const MonoTd = ({ children }) => <td className="mono">{children}</td>;

const ModalHeader = (
  <div className="Auction-warning">
    <strong>
      <h4>Screenshot & Save</h4>
    </strong>
    You cannot claim your name unless you have this information during the reveal process.
  </div>
);

const Details = (
  <div className="table-wrapper">
    <table className="table table-striped">
      <tbody>
        <tr>
          <td>Name: </td>
          <MonoTd>{name}.eth</MonoTd>
        </tr>
        <tr>
          <td>Bid: </td>
          <MonoTd>{'bid'}</MonoTd>
        </tr>
        <tr>
          <td>Bid Mask:</td>
          <MonoTd>{'mask'}</MonoTd>
        </tr>
        <tr>
          <td>Secret Phrase:</td>
          <MonoTd>{'phrase'}</MonoTd>
        </tr>
        <tr>
          <td>From:</td>
          <MonoTd>{'from'}</MonoTd>
        </tr>
        <tr>
          <td>Reveal Date:</td>
          <MonoTd>{'date'}</MonoTd>
        </tr>
        <tr>
          <td>Auction Ends:</td>
          <MonoTd>
            <span>{'date'}</span>
          </MonoTd>
        </tr>
      </tbody>
    </table>
    {/* use css not br's */}
    <br />
    <p>Copy and save this:</p>
    <textarea className="form-control" readOnly={true} value={JSON.stringify('transaction')} />

    <div className="BidModal-details-detail text-center">
      You are interacting with the <strong>{node.network}</strong> network provided by{' '}
      <strong>{node.service}</strong>
    </div>
  </div>
);

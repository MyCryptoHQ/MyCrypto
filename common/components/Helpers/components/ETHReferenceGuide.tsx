import React, { Component } from 'react';
import './ETHReferenceGuide.scss';

export default class ETHReferenceGuide extends Component {
  public render() {
    return (
      <div>
        <h1> Ether Unit Reference Guide </h1>
        <table className="ETHReferenceGuide-table table mono">
          <tr>
            <td>
              <strong>wei</strong>
            </td>
            <td>
              <small />
            </td>
            <td>1</td>
            <td>1</td>
            <td />
          </tr>
          <tr>
            <td>
              <strong>kwei</strong>
            </td>
            <td>
              <small>ada, femtoether</small>
            </td>
            <td>1000</td>
            <td>1,000</td>
            <td>
              10<sup>3</sup>
            </td>
          </tr>
          <tr>
            <td>
              <strong>mwei</strong>
            </td>
            <td>
              <small>babbage, picoether</small>
            </td>
            <td>1000000</td>
            <td>1,000,000</td>
            <td>
              10<sup>6</sup>
            </td>
          </tr>
          <tr>
            <td>
              <strong>gwei</strong>
            </td>
            <td>
              <small>shannon, nanoether, nano</small>
            </td>
            <td>1000000000</td>
            <td>1,000,000,000</td>
            <td>
              10<sup>9</sup>
            </td>
          </tr>
          <tr>
            <td>
              <strong>szabo</strong>
            </td>
            <td>
              <small>microether, micro</small>
            </td>
            <td>1000000000000</td>
            <td>1,000,000,000,000</td>
            <td>
              10<sup>12</sup>
            </td>
          </tr>
          <tr>
            <td>
              <strong>finney</strong>
            </td>
            <td>
              <small>milliether, milli</small>
            </td>
            <td>1000000000000000</td>
            <td>1,000,000,000,000,000</td>
            <td>
              10<sup>15</sup>
            </td>
          </tr>
          <tr>
            <td>
              <strong>ether</strong>
            </td>
            <td>
              <small />
            </td>
            <td>1000000000000000000</td>
            <td>1,000,000,000,000,000,000</td>
            <td>
              10<sup>18</sup>
            </td>
          </tr>
          <tr>
            <td>
              <strong>kether</strong>
            </td>
            <td>
              <small>grand, einstein</small>
            </td>
            <td>1000000000000000000000</td>
            <td>1,000,000,000,000,000,000,000</td>
            <td>
              10<sup>21</sup>
            </td>
          </tr>
          <tr>
            <td>
              <strong>mether</strong>
            </td>
            <td>
              <small />
            </td>
            <td>1000000000000000000000000</td>
            <td>1,000,000,000,000,000,000,000,000</td>
            <td>
              10<sup>24</sup>
            </td>
          </tr>
          <tr>
            <td>
              <strong>gether</strong>
            </td>
            <td>
              <small />
            </td>
            <td>1000000000000000000000000000</td>
            <td>1,000,000,000,000,000,000,000,000,000</td>
            <td>
              10<sup>27</sup>
            </td>
          </tr>
          <tr>
            <td>
              <strong>tether </strong>
            </td>
            <td>
              <small />
            </td>
            <td>1000000000000000000000000000000</td>
            <td>1000,000,000,000,000,000,000,000,000,000</td>
            <td>
              10<sup>30</sup>
            </td>
          </tr>
        </table>
      </div>
    );
  }
}

export default JSON.stringify({
  package: null,
  messages: [
    {
      name: 'MultisigRedeemScriptType',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'HDNodePathType',
          name: 'pubkeys',
          id: 1
        },
        {
          rule: 'repeated',
          options: {},
          type: 'bytes',
          name: 'signatures',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'm',
          id: 3
        },
        {
          rule: 'repeated',
          options: {},
          type: 'HDNodeType',
          name: 'nodes',
          id: 4
        },
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 5
        }
      ],
      enums: [],
      messages: [
        {
          name: 'HDNodePathType',
          fields: [
            {
              rule: 'required',
              options: {},
              type: 'HDNodeType',
              name: 'node',
              id: 1
            },
            {
              rule: 'repeated',
              options: {},
              type: 'uint32',
              name: 'address_n',
              id: 2
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        }
      ],
      options: {},
      oneofs: {}
    },
    {
      name: 'GetPublicKey',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'ecdsa_curve_name',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'show_display',
          id: 3
        },
        {
          rule: 'optional',
          options: {
            default: 'Bitcoin'
          },
          type: 'string',
          name: 'coin_name',
          id: 4
        },
        {
          rule: 'optional',
          options: {
            default: 'SPENDADDRESS'
          },
          type: 'InputScriptType',
          name: 'script_type',
          id: 5
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'PublicKey',
      fields: [
        {
          rule: 'required',
          options: {},
          type: 'HDNodeType',
          name: 'node',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'xpub',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'GetAddress',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {
            default: 'Bitcoin'
          },
          type: 'string',
          name: 'coin_name',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'show_display',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'MultisigRedeemScriptType',
          name: 'multisig',
          id: 4
        },
        {
          rule: 'optional',
          options: {
            default: 'SPENDADDRESS'
          },
          type: 'InputScriptType',
          name: 'script_type',
          id: 5
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'Address',
      fields: [
        {
          rule: 'required',
          options: {},
          type: 'string',
          name: 'address',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'SignMessage',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'required',
          options: {},
          type: 'bytes',
          name: 'message',
          id: 2
        },
        {
          rule: 'optional',
          options: {
            default: 'Bitcoin'
          },
          type: 'string',
          name: 'coin_name',
          id: 3
        },
        {
          rule: 'optional',
          options: {
            default: 'SPENDADDRESS'
          },
          type: 'InputScriptType',
          name: 'script_type',
          id: 4
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MessageSignature',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'address',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'signature',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'VerifyMessage',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'address',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'signature',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'message',
          id: 3
        },
        {
          rule: 'optional',
          options: {
            default: 'Bitcoin'
          },
          type: 'string',
          name: 'coin_name',
          id: 4
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'SignTx',
      fields: [
        {
          rule: 'required',
          options: {},
          type: 'uint32',
          name: 'outputs_count',
          id: 1
        },
        {
          rule: 'required',
          options: {},
          type: 'uint32',
          name: 'inputs_count',
          id: 2
        },
        {
          rule: 'optional',
          options: {
            default: 'Bitcoin'
          },
          type: 'string',
          name: 'coin_name',
          id: 3
        },
        {
          rule: 'optional',
          options: {
            default: 1
          },
          type: 'uint32',
          name: 'version',
          id: 4
        },
        {
          rule: 'optional',
          options: {
            default: 0
          },
          type: 'uint32',
          name: 'lock_time',
          id: 5
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'expiry',
          id: 6
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'overwintered',
          id: 7
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'version_group_id',
          id: 8
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'timestamp',
          id: 9
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'branch_id',
          id: 10
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'TxRequest',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'RequestType',
          name: 'request_type',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'TxRequestDetailsType',
          name: 'details',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'TxRequestSerializedType',
          name: 'serialized',
          id: 3
        }
      ],
      enums: [
        {
          name: 'RequestType',
          values: [
            {
              name: 'TXINPUT',
              id: 0
            },
            {
              name: 'TXOUTPUT',
              id: 1
            },
            {
              name: 'TXMETA',
              id: 2
            },
            {
              name: 'TXFINISHED',
              id: 3
            },
            {
              name: 'TXEXTRADATA',
              id: 4
            }
          ],
          options: {}
        }
      ],
      messages: [
        {
          name: 'TxRequestDetailsType',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'request_index',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'tx_hash',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'extra_data_len',
              id: 3
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'extra_data_offset',
              id: 4
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'TxRequestSerializedType',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'signature_index',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'signature',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'serialized_tx',
              id: 3
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        }
      ],
      options: {},
      oneofs: {}
    },
    {
      name: 'TxAck',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'TransactionType',
          name: 'tx',
          id: 1
        }
      ],
      enums: [],
      messages: [
        {
          name: 'TransactionType',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'version',
              id: 1
            },
            {
              rule: 'repeated',
              options: {},
              type: 'TxInputType',
              name: 'inputs',
              id: 2
            },
            {
              rule: 'repeated',
              options: {},
              type: 'TxOutputBinType',
              name: 'bin_outputs',
              id: 3
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'lock_time',
              id: 4
            },
            {
              rule: 'repeated',
              options: {},
              type: 'TxOutputType',
              name: 'outputs',
              id: 5
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'inputs_cnt',
              id: 6
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'outputs_cnt',
              id: 7
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'extra_data',
              id: 8
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'extra_data_len',
              id: 9
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'expiry',
              id: 10
            },
            {
              rule: 'optional',
              options: {},
              type: 'bool',
              name: 'overwintered',
              id: 11
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'version_group_id',
              id: 12
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'timestamp',
              id: 13
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'branch_id',
              id: 14
            }
          ],
          enums: [],
          messages: [
            {
              name: 'TxInputType',
              fields: [
                {
                  rule: 'repeated',
                  options: {},
                  type: 'uint32',
                  name: 'address_n',
                  id: 1
                },
                {
                  rule: 'required',
                  options: {},
                  type: 'bytes',
                  name: 'prev_hash',
                  id: 2
                },
                {
                  rule: 'required',
                  options: {},
                  type: 'uint32',
                  name: 'prev_index',
                  id: 3
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'bytes',
                  name: 'script_sig',
                  id: 4
                },
                {
                  rule: 'optional',
                  options: {
                    default: 4294967295
                  },
                  type: 'uint32',
                  name: 'sequence',
                  id: 5
                },
                {
                  rule: 'optional',
                  options: {
                    default: 'SPENDADDRESS'
                  },
                  type: 'InputScriptType',
                  name: 'script_type',
                  id: 6
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'MultisigRedeemScriptType',
                  name: 'multisig',
                  id: 7
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'uint64',
                  name: 'amount',
                  id: 8
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'uint32',
                  name: 'decred_tree',
                  id: 9
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'uint32',
                  name: 'decred_script_version',
                  id: 10
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'bytes',
                  name: 'prev_block_hash_bip115',
                  id: 11
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'uint32',
                  name: 'prev_block_height_bip115',
                  id: 12
                }
              ],
              enums: [],
              messages: [],
              options: {},
              oneofs: {}
            },
            {
              name: 'TxOutputBinType',
              fields: [
                {
                  rule: 'required',
                  options: {},
                  type: 'uint64',
                  name: 'amount',
                  id: 1
                },
                {
                  rule: 'required',
                  options: {},
                  type: 'bytes',
                  name: 'script_pubkey',
                  id: 2
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'uint32',
                  name: 'decred_script_version',
                  id: 3
                }
              ],
              enums: [],
              messages: [],
              options: {},
              oneofs: {}
            },
            {
              name: 'TxOutputType',
              fields: [
                {
                  rule: 'optional',
                  options: {},
                  type: 'string',
                  name: 'address',
                  id: 1
                },
                {
                  rule: 'repeated',
                  options: {},
                  type: 'uint32',
                  name: 'address_n',
                  id: 2
                },
                {
                  rule: 'required',
                  options: {},
                  type: 'uint64',
                  name: 'amount',
                  id: 3
                },
                {
                  rule: 'required',
                  options: {},
                  type: 'OutputScriptType',
                  name: 'script_type',
                  id: 4
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'MultisigRedeemScriptType',
                  name: 'multisig',
                  id: 5
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'bytes',
                  name: 'op_return_data',
                  id: 6
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'uint32',
                  name: 'decred_script_version',
                  id: 7
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'bytes',
                  name: 'block_hash_bip115',
                  id: 8
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'uint32',
                  name: 'block_height_bip115',
                  id: 9
                }
              ],
              enums: [
                {
                  name: 'OutputScriptType',
                  values: [
                    {
                      name: 'PAYTOADDRESS',
                      id: 0
                    },
                    {
                      name: 'PAYTOSCRIPTHASH',
                      id: 1
                    },
                    {
                      name: 'PAYTOMULTISIG',
                      id: 2
                    },
                    {
                      name: 'PAYTOOPRETURN',
                      id: 3
                    },
                    {
                      name: 'PAYTOWITNESS',
                      id: 4
                    },
                    {
                      name: 'PAYTOP2SHWITNESS',
                      id: 5
                    }
                  ],
                  options: {}
                }
              ],
              messages: [],
              options: {},
              oneofs: {}
            }
          ],
          options: {},
          oneofs: {}
        }
      ],
      options: {},
      oneofs: {}
    },
    {
      name: 'FirmwareErase',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'length',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'FirmwareRequest',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'offset',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'length',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'FirmwareUpload',
      fields: [
        {
          rule: 'required',
          options: {},
          type: 'bytes',
          name: 'payload',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'hash',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'SelfTest',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'payload',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'CardanoGetAddress',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'show_display',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'CardanoAddress',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'address',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'CardanoGetPublicKey',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'show_display',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'CardanoPublicKey',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'xpub',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'HDNodeType',
          name: 'node',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'CardanoSignTx',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'CardanoTxInputType',
          name: 'inputs',
          id: 1
        },
        {
          rule: 'repeated',
          options: {},
          type: 'CardanoTxOutputType',
          name: 'outputs',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'transactions_count',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'protocol_magic',
          id: 5
        }
      ],
      enums: [],
      messages: [
        {
          name: 'CardanoTxInputType',
          fields: [
            {
              rule: 'repeated',
              options: {},
              type: 'uint32',
              name: 'address_n',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'prev_hash',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'prev_index',
              id: 3
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'type',
              id: 4
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'CardanoTxOutputType',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'string',
              name: 'address',
              id: 1
            },
            {
              rule: 'repeated',
              options: {},
              type: 'uint32',
              name: 'address_n',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'amount',
              id: 3
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        }
      ],
      options: {},
      oneofs: {}
    },
    {
      name: 'CardanoTxRequest',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'tx_index',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'tx_hash',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'tx_body',
          id: 3
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'CardanoTxAck',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'transaction',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'CardanoSignedTx',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'tx_hash',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'tx_body',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'Success',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'message',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'Failure',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'FailureType',
          name: 'code',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'message',
          id: 2
        }
      ],
      enums: [
        {
          name: 'FailureType',
          values: [
            {
              name: 'Failure_UnexpectedMessage',
              id: 1
            },
            {
              name: 'Failure_ButtonExpected',
              id: 2
            },
            {
              name: 'Failure_DataError',
              id: 3
            },
            {
              name: 'Failure_ActionCancelled',
              id: 4
            },
            {
              name: 'Failure_PinExpected',
              id: 5
            },
            {
              name: 'Failure_PinCancelled',
              id: 6
            },
            {
              name: 'Failure_PinInvalid',
              id: 7
            },
            {
              name: 'Failure_InvalidSignature',
              id: 8
            },
            {
              name: 'Failure_ProcessError',
              id: 9
            },
            {
              name: 'Failure_NotEnoughFunds',
              id: 10
            },
            {
              name: 'Failure_NotInitialized',
              id: 11
            },
            {
              name: 'Failure_PinMismatch',
              id: 12
            },
            {
              name: 'Failure_FirmwareError',
              id: 99
            }
          ],
          options: {}
        }
      ],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'ButtonRequest',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'ButtonRequestType',
          name: 'code',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'data',
          id: 2
        }
      ],
      enums: [
        {
          name: 'ButtonRequestType',
          values: [
            {
              name: 'ButtonRequest_Other',
              id: 1
            },
            {
              name: 'ButtonRequest_FeeOverThreshold',
              id: 2
            },
            {
              name: 'ButtonRequest_ConfirmOutput',
              id: 3
            },
            {
              name: 'ButtonRequest_ResetDevice',
              id: 4
            },
            {
              name: 'ButtonRequest_ConfirmWord',
              id: 5
            },
            {
              name: 'ButtonRequest_WipeDevice',
              id: 6
            },
            {
              name: 'ButtonRequest_ProtectCall',
              id: 7
            },
            {
              name: 'ButtonRequest_SignTx',
              id: 8
            },
            {
              name: 'ButtonRequest_FirmwareCheck',
              id: 9
            },
            {
              name: 'ButtonRequest_Address',
              id: 10
            },
            {
              name: 'ButtonRequest_PublicKey',
              id: 11
            },
            {
              name: 'ButtonRequest_MnemonicWordCount',
              id: 12
            },
            {
              name: 'ButtonRequest_MnemonicInput',
              id: 13
            },
            {
              name: 'ButtonRequest_PassphraseType',
              id: 14
            },
            {
              name: 'ButtonRequest_UnknownDerivationPath',
              id: 15
            }
          ],
          options: {}
        }
      ],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'ButtonAck',
      fields: [],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'PinMatrixRequest',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'PinMatrixRequestType',
          name: 'type',
          id: 1
        }
      ],
      enums: [
        {
          name: 'PinMatrixRequestType',
          values: [
            {
              name: 'PinMatrixRequestType_Current',
              id: 1
            },
            {
              name: 'PinMatrixRequestType_NewFirst',
              id: 2
            },
            {
              name: 'PinMatrixRequestType_NewSecond',
              id: 3
            }
          ],
          options: {}
        }
      ],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'PinMatrixAck',
      fields: [
        {
          rule: 'required',
          options: {},
          type: 'string',
          name: 'pin',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'PassphraseRequest',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'on_device',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'PassphraseAck',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'passphrase',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'state',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'PassphraseStateRequest',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'state',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'PassphraseStateAck',
      fields: [],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'HDNodeType',
      fields: [
        {
          rule: 'required',
          options: {},
          type: 'uint32',
          name: 'depth',
          id: 1
        },
        {
          rule: 'required',
          options: {},
          type: 'uint32',
          name: 'fingerprint',
          id: 2
        },
        {
          rule: 'required',
          options: {},
          type: 'uint32',
          name: 'child_num',
          id: 3
        },
        {
          rule: 'required',
          options: {},
          type: 'bytes',
          name: 'chain_code',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'private_key',
          id: 5
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'public_key',
          id: 6
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'CipherKeyValue',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'key',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'value',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'encrypt',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'ask_on_encrypt',
          id: 5
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'ask_on_decrypt',
          id: 6
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'iv',
          id: 7
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'CipheredKeyValue',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'value',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'IdentityType',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'proto',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'user',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'host',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'port',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'path',
          id: 5
        },
        {
          rule: 'optional',
          options: {
            default: 0
          },
          type: 'uint32',
          name: 'index',
          id: 6
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'SignIdentity',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'IdentityType',
          name: 'identity',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'challenge_hidden',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'challenge_visual',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'ecdsa_curve_name',
          id: 4
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'SignedIdentity',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'address',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'public_key',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'signature',
          id: 3
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'GetECDHSessionKey',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'IdentityType',
          name: 'identity',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'peer_public_key',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'ecdsa_curve_name',
          id: 3
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'ECDHSessionKey',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'session_key',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'CosiCommit',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'data',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'CosiCommitment',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'commitment',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'pubkey',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'CosiSign',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'data',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'global_commitment',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'global_pubkey',
          id: 4
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'CosiSignature',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'signature',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'DebugLinkDecision',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'yes_no',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'up_down',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'input',
          id: 3
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'DebugLinkGetState',
      fields: [],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'DebugLinkState',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'layout',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'pin',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'matrix',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'mnemonic',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'HDNodeType',
          name: 'node',
          id: 5
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'passphrase_protection',
          id: 6
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'reset_word',
          id: 7
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'reset_entropy',
          id: 8
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'recovery_fake_word',
          id: 9
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'recovery_word_pos',
          id: 10
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'reset_word_pos',
          id: 11
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'DebugLinkStop',
      fields: [],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'DebugLinkLog',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'level',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'bucket',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'text',
          id: 3
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'DebugLinkMemoryRead',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'address',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'length',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'DebugLinkMemory',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'memory',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'DebugLinkMemoryWrite',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'address',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'memory',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'flash',
          id: 3
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'DebugLinkFlashErase',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'sector',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'EosGetPublicKey',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'show_display',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'EosPublicKey',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'wif_public_key',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'raw_public_key',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'EosSignTx',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'chain_id',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'EosTxHeader',
          name: 'header',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'num_actions',
          id: 4
        }
      ],
      enums: [],
      messages: [
        {
          name: 'EosTxHeader',
          fields: [
            {
              rule: 'required',
              options: {},
              type: 'uint32',
              name: 'expiration',
              id: 1
            },
            {
              rule: 'required',
              options: {},
              type: 'uint32',
              name: 'ref_block_num',
              id: 2
            },
            {
              rule: 'required',
              options: {},
              type: 'uint32',
              name: 'ref_block_prefix',
              id: 3
            },
            {
              rule: 'required',
              options: {},
              type: 'uint32',
              name: 'max_net_usage_words',
              id: 4
            },
            {
              rule: 'required',
              options: {},
              type: 'uint32',
              name: 'max_cpu_usage_ms',
              id: 5
            },
            {
              rule: 'required',
              options: {},
              type: 'uint32',
              name: 'delay_sec',
              id: 6
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        }
      ],
      options: {},
      oneofs: {}
    },
    {
      name: 'EosTxActionRequest',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'data_size',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'EosTxActionAck',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'EosActionCommon',
          name: 'common',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'EosActionTransfer',
          name: 'transfer',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'EosActionDelegate',
          name: 'delegate',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'EosActionUndelegate',
          name: 'undelegate',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'EosActionRefund',
          name: 'refund',
          id: 5
        },
        {
          rule: 'optional',
          options: {},
          type: 'EosActionBuyRam',
          name: 'buy_ram',
          id: 6
        },
        {
          rule: 'optional',
          options: {},
          type: 'EosActionBuyRamBytes',
          name: 'buy_ram_bytes',
          id: 7
        },
        {
          rule: 'optional',
          options: {},
          type: 'EosActionSellRam',
          name: 'sell_ram',
          id: 8
        },
        {
          rule: 'optional',
          options: {},
          type: 'EosActionVoteProducer',
          name: 'vote_producer',
          id: 9
        },
        {
          rule: 'optional',
          options: {},
          type: 'EosActionUpdateAuth',
          name: 'update_auth',
          id: 10
        },
        {
          rule: 'optional',
          options: {},
          type: 'EosActionDeleteAuth',
          name: 'delete_auth',
          id: 11
        },
        {
          rule: 'optional',
          options: {},
          type: 'EosActionLinkAuth',
          name: 'link_auth',
          id: 12
        },
        {
          rule: 'optional',
          options: {},
          type: 'EosActionUnlinkAuth',
          name: 'unlink_auth',
          id: 13
        },
        {
          rule: 'optional',
          options: {},
          type: 'EosActionNewAccount',
          name: 'new_account',
          id: 14
        },
        {
          rule: 'optional',
          options: {},
          type: 'EosActionUnknown',
          name: 'unknown',
          id: 15
        }
      ],
      enums: [],
      messages: [
        {
          name: 'EosAsset',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'sint64',
              name: 'amount',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'symbol',
              id: 2
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'EosPermissionLevel',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'actor',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'permission',
              id: 2
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'EosAuthorizationKey',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'type',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'key',
              id: 2
            },
            {
              rule: 'repeated',
              options: {},
              type: 'uint32',
              name: 'address_n',
              id: 3
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'weight',
              id: 4
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'EosAuthorizationAccount',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'EosPermissionLevel',
              name: 'account',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'weight',
              id: 2
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'EosAuthorizationWait',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'wait_sec',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'weight',
              id: 2
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'EosAuthorization',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'threshold',
              id: 1
            },
            {
              rule: 'repeated',
              options: {},
              type: 'EosAuthorizationKey',
              name: 'keys',
              id: 2
            },
            {
              rule: 'repeated',
              options: {},
              type: 'EosAuthorizationAccount',
              name: 'accounts',
              id: 3
            },
            {
              rule: 'repeated',
              options: {},
              type: 'EosAuthorizationWait',
              name: 'waits',
              id: 4
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'EosActionCommon',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'account',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'name',
              id: 2
            },
            {
              rule: 'repeated',
              options: {},
              type: 'EosPermissionLevel',
              name: 'authorization',
              id: 3
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'EosActionTransfer',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'sender',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'receiver',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'EosAsset',
              name: 'quantity',
              id: 3
            },
            {
              rule: 'optional',
              options: {},
              type: 'string',
              name: 'memo',
              id: 4
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'EosActionDelegate',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'sender',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'receiver',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'EosAsset',
              name: 'net_quantity',
              id: 3
            },
            {
              rule: 'optional',
              options: {},
              type: 'EosAsset',
              name: 'cpu_quantity',
              id: 4
            },
            {
              rule: 'optional',
              options: {},
              type: 'bool',
              name: 'transfer',
              id: 5
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'EosActionUndelegate',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'sender',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'receiver',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'EosAsset',
              name: 'net_quantity',
              id: 3
            },
            {
              rule: 'optional',
              options: {},
              type: 'EosAsset',
              name: 'cpu_quantity',
              id: 4
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'EosActionRefund',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'owner',
              id: 1
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'EosActionBuyRam',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'payer',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'receiver',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'EosAsset',
              name: 'quantity',
              id: 3
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'EosActionBuyRamBytes',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'payer',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'receiver',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'bytes',
              id: 3
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'EosActionSellRam',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'account',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'bytes',
              id: 2
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'EosActionVoteProducer',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'voter',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'proxy',
              id: 2
            },
            {
              rule: 'repeated',
              options: {},
              type: 'uint64',
              name: 'producers',
              id: 3
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'EosActionUpdateAuth',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'account',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'permission',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'parent',
              id: 3
            },
            {
              rule: 'optional',
              options: {},
              type: 'EosAuthorization',
              name: 'auth',
              id: 4
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'EosActionDeleteAuth',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'account',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'permission',
              id: 2
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'EosActionLinkAuth',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'account',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'code',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'type',
              id: 3
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'requirement',
              id: 4
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'EosActionUnlinkAuth',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'account',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'code',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'type',
              id: 3
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'EosActionNewAccount',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'creator',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'name',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'EosAuthorization',
              name: 'owner',
              id: 3
            },
            {
              rule: 'optional',
              options: {},
              type: 'EosAuthorization',
              name: 'active',
              id: 4
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'EosActionUnknown',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'data_size',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'data_chunk',
              id: 2
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        }
      ],
      options: {},
      oneofs: {}
    },
    {
      name: 'EosSignedTx',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'signature_v',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'signature_r',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'signature_s',
          id: 3
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'EthereumGetPublicKey',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'show_display',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'EthereumPublicKey',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'HDNodeType',
          name: 'node',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'xpub',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'EthereumGetAddress',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'show_display',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'EthereumAddress',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'address',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'EthereumSignTx',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'nonce',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'gas_price',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'gas_limit',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'to',
          id: 11
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'value',
          id: 6
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'data_initial_chunk',
          id: 7
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'data_length',
          id: 8
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'chain_id',
          id: 9
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'tx_type',
          id: 10
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'EthereumTxRequest',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'data_length',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'signature_v',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'signature_r',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'signature_s',
          id: 4
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'EthereumTxAck',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'data_chunk',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'EthereumSignMessage',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'message',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'EthereumMessageSignature',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'signature',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'address',
          id: 3
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'EthereumVerifyMessage',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'signature',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'message',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'address',
          id: 4
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'LiskGetAddress',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'show_display',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'LiskAddress',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'address',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'LiskGetPublicKey',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'show_display',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'LiskPublicKey',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'public_key',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'LiskSignTx',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'LiskTransactionCommon',
          name: 'transaction',
          id: 2
        }
      ],
      enums: [],
      messages: [
        {
          name: 'LiskTransactionCommon',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'LiskTransactionType',
              name: 'type',
              id: 1
            },
            {
              rule: 'optional',
              options: {
                default: 0
              },
              type: 'uint64',
              name: 'amount',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'fee',
              id: 3
            },
            {
              rule: 'optional',
              options: {},
              type: 'string',
              name: 'recipient_id',
              id: 4
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'sender_public_key',
              id: 5
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'requester_public_key',
              id: 6
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'signature',
              id: 7
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'timestamp',
              id: 8
            },
            {
              rule: 'optional',
              options: {},
              type: 'LiskTransactionAsset',
              name: 'asset',
              id: 9
            }
          ],
          enums: [
            {
              name: 'LiskTransactionType',
              values: [
                {
                  name: 'Transfer',
                  id: 0
                },
                {
                  name: 'RegisterSecondPassphrase',
                  id: 1
                },
                {
                  name: 'RegisterDelegate',
                  id: 2
                },
                {
                  name: 'CastVotes',
                  id: 3
                },
                {
                  name: 'RegisterMultisignatureAccount',
                  id: 4
                },
                {
                  name: 'CreateDapp',
                  id: 5
                },
                {
                  name: 'TransferIntoDapp',
                  id: 6
                },
                {
                  name: 'TransferOutOfDapp',
                  id: 7
                }
              ],
              options: {}
            }
          ],
          messages: [
            {
              name: 'LiskTransactionAsset',
              fields: [
                {
                  rule: 'optional',
                  options: {},
                  type: 'LiskSignatureType',
                  name: 'signature',
                  id: 1
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'LiskDelegateType',
                  name: 'delegate',
                  id: 2
                },
                {
                  rule: 'repeated',
                  options: {},
                  type: 'string',
                  name: 'votes',
                  id: 3
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'LiskMultisignatureType',
                  name: 'multisignature',
                  id: 4
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'string',
                  name: 'data',
                  id: 5
                }
              ],
              enums: [],
              messages: [
                {
                  name: 'LiskSignatureType',
                  fields: [
                    {
                      rule: 'optional',
                      options: {},
                      type: 'bytes',
                      name: 'public_key',
                      id: 1
                    }
                  ],
                  enums: [],
                  messages: [],
                  options: {},
                  oneofs: {}
                },
                {
                  name: 'LiskDelegateType',
                  fields: [
                    {
                      rule: 'optional',
                      options: {},
                      type: 'string',
                      name: 'username',
                      id: 1
                    }
                  ],
                  enums: [],
                  messages: [],
                  options: {},
                  oneofs: {}
                },
                {
                  name: 'LiskMultisignatureType',
                  fields: [
                    {
                      rule: 'optional',
                      options: {},
                      type: 'uint32',
                      name: 'min',
                      id: 1
                    },
                    {
                      rule: 'optional',
                      options: {},
                      type: 'uint32',
                      name: 'life_time',
                      id: 2
                    },
                    {
                      rule: 'repeated',
                      options: {},
                      type: 'string',
                      name: 'keys_group',
                      id: 3
                    }
                  ],
                  enums: [],
                  messages: [],
                  options: {},
                  oneofs: {}
                }
              ],
              options: {},
              oneofs: {}
            }
          ],
          options: {},
          oneofs: {}
        }
      ],
      options: {},
      oneofs: {}
    },
    {
      name: 'LiskSignedTx',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'signature',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'LiskSignMessage',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'message',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'LiskMessageSignature',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'public_key',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'signature',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'LiskVerifyMessage',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'public_key',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'signature',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'message',
          id: 3
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'Initialize',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'state',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'skip_passphrase',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'GetFeatures',
      fields: [],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'Features',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'vendor',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'major_version',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'minor_version',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'patch_version',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'bootloader_mode',
          id: 5
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'device_id',
          id: 6
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'pin_protection',
          id: 7
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'passphrase_protection',
          id: 8
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'language',
          id: 9
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'label',
          id: 10
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'initialized',
          id: 12
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'revision',
          id: 13
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'bootloader_hash',
          id: 14
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'imported',
          id: 15
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'pin_cached',
          id: 16
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'passphrase_cached',
          id: 17
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'firmware_present',
          id: 18
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'needs_backup',
          id: 19
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'flags',
          id: 20
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'model',
          id: 21
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'fw_major',
          id: 22
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'fw_minor',
          id: 23
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'fw_patch',
          id: 24
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'fw_vendor',
          id: 25
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'fw_vendor_keys',
          id: 26
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'unfinished_backup',
          id: 27
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'no_backup',
          id: 28
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'ClearSession',
      fields: [],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'ApplySettings',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'language',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'label',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'use_passphrase',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'homescreen',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'PassphraseSourceType',
          name: 'passphrase_source',
          id: 5
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'auto_lock_delay_ms',
          id: 6
        }
      ],
      enums: [
        {
          name: 'PassphraseSourceType',
          values: [
            {
              name: 'ASK',
              id: 0
            },
            {
              name: 'DEVICE',
              id: 1
            },
            {
              name: 'HOST',
              id: 2
            }
          ],
          options: {}
        }
      ],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'ApplyFlags',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'flags',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'ChangePin',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'remove',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'Ping',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'message',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'button_protection',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'pin_protection',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'passphrase_protection',
          id: 4
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'Cancel',
      fields: [],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'GetEntropy',
      fields: [
        {
          rule: 'required',
          options: {},
          type: 'uint32',
          name: 'size',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'Entropy',
      fields: [
        {
          rule: 'required',
          options: {},
          type: 'bytes',
          name: 'entropy',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'WipeDevice',
      fields: [],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'LoadDevice',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'mnemonic',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'HDNodeType',
          name: 'node',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'pin',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'passphrase_protection',
          id: 4
        },
        {
          rule: 'optional',
          options: {
            default: 'english'
          },
          type: 'string',
          name: 'language',
          id: 5
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'label',
          id: 6
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'skip_checksum',
          id: 7
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'u2f_counter',
          id: 8
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'ResetDevice',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'display_random',
          id: 1
        },
        {
          rule: 'optional',
          options: {
            default: 256
          },
          type: 'uint32',
          name: 'strength',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'passphrase_protection',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'pin_protection',
          id: 4
        },
        {
          rule: 'optional',
          options: {
            default: 'english'
          },
          type: 'string',
          name: 'language',
          id: 5
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'label',
          id: 6
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'u2f_counter',
          id: 7
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'skip_backup',
          id: 8
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'no_backup',
          id: 9
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'BackupDevice',
      fields: [],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'EntropyRequest',
      fields: [],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'EntropyAck',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'entropy',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'RecoveryDevice',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'word_count',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'passphrase_protection',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'pin_protection',
          id: 3
        },
        {
          rule: 'optional',
          options: {
            default: 'english'
          },
          type: 'string',
          name: 'language',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'label',
          id: 5
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'enforce_wordlist',
          id: 6
        },
        {
          rule: 'optional',
          options: {},
          type: 'RecoveryDeviceType',
          name: 'type',
          id: 8
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'u2f_counter',
          id: 9
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'dry_run',
          id: 10
        }
      ],
      enums: [
        {
          name: 'RecoveryDeviceType',
          values: [
            {
              name: 'RecoveryDeviceType_ScrambledWords',
              id: 0
            },
            {
              name: 'RecoveryDeviceType_Matrix',
              id: 1
            }
          ],
          options: {}
        }
      ],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'WordRequest',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'WordRequestType',
          name: 'type',
          id: 1
        }
      ],
      enums: [
        {
          name: 'WordRequestType',
          values: [
            {
              name: 'WordRequestType_Plain',
              id: 0
            },
            {
              name: 'WordRequestType_Matrix9',
              id: 1
            },
            {
              name: 'WordRequestType_Matrix6',
              id: 2
            }
          ],
          options: {}
        }
      ],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'WordAck',
      fields: [
        {
          rule: 'required',
          options: {},
          type: 'string',
          name: 'word',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'SetU2FCounter',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'u2f_counter',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroTransactionSourceEntry',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'MoneroOutputEntry',
          name: 'outputs',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint64',
          name: 'real_output',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'real_out_tx_key',
          id: 3
        },
        {
          rule: 'repeated',
          options: {},
          type: 'bytes',
          name: 'real_out_additional_tx_keys',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint64',
          name: 'real_output_in_tx_index',
          id: 5
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint64',
          name: 'amount',
          id: 6
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'rct',
          id: 7
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'mask',
          id: 8
        },
        {
          rule: 'optional',
          options: {},
          type: 'MoneroMultisigKLRki',
          name: 'multisig_kLRki',
          id: 9
        }
      ],
      enums: [],
      messages: [
        {
          name: 'MoneroOutputEntry',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'idx',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'MoneroRctKeyPublic',
              name: 'key',
              id: 2
            }
          ],
          enums: [],
          messages: [
            {
              name: 'MoneroRctKeyPublic',
              fields: [
                {
                  rule: 'optional',
                  options: {},
                  type: 'bytes',
                  name: 'dest',
                  id: 1
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'bytes',
                  name: 'commitment',
                  id: 2
                }
              ],
              enums: [],
              messages: [],
              options: {},
              oneofs: {}
            }
          ],
          options: {},
          oneofs: {}
        },
        {
          name: 'MoneroMultisigKLRki',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'K',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'L',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'R',
              id: 3
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'ki',
              id: 4
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        }
      ],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroTransactionDestinationEntry',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'uint64',
          name: 'amount',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'MoneroAccountPublicAddress',
          name: 'addr',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'is_subaddress',
          id: 3
        }
      ],
      enums: [],
      messages: [
        {
          name: 'MoneroAccountPublicAddress',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'spend_public_key',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'view_public_key',
              id: 2
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        }
      ],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroTransactionRsigData',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'rsig_type',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'offload_type',
          id: 2
        },
        {
          rule: 'repeated',
          options: {},
          type: 'uint64',
          name: 'grouping',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'mask',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'rsig',
          id: 5
        },
        {
          rule: 'repeated',
          options: {},
          type: 'bytes',
          name: 'rsig_parts',
          id: 6
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroGetAddress',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'show_display',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'network_type',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'account',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'minor',
          id: 5
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroAddress',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'address',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroGetWatchKey',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'network_type',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroWatchKey',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'watch_key',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'address',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroTransactionInitRequest',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'version',
          id: 1
        },
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'network_type',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'MoneroTransactionData',
          name: 'tsx_data',
          id: 4
        }
      ],
      enums: [],
      messages: [
        {
          name: 'MoneroTransactionData',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'version',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'payment_id',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'unlock_time',
              id: 3
            },
            {
              rule: 'repeated',
              options: {},
              type: 'MoneroTransactionDestinationEntry',
              name: 'outputs',
              id: 4
            },
            {
              rule: 'optional',
              options: {},
              type: 'MoneroTransactionDestinationEntry',
              name: 'change_dts',
              id: 5
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'num_inputs',
              id: 6
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'mixin',
              id: 7
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'fee',
              id: 8
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'account',
              id: 9
            },
            {
              rule: 'repeated',
              options: {},
              type: 'uint32',
              name: 'minor_indices',
              id: 10
            },
            {
              rule: 'optional',
              options: {},
              type: 'MoneroTransactionRsigData',
              name: 'rsig_data',
              id: 11
            },
            {
              rule: 'repeated',
              options: {},
              type: 'uint32',
              name: 'integrated_indices',
              id: 12
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        }
      ],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroTransactionInitAck',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'bytes',
          name: 'hmacs',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'MoneroTransactionRsigData',
          name: 'rsig_data',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroTransactionSetInputRequest',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'MoneroTransactionSourceEntry',
          name: 'src_entr',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroTransactionSetInputAck',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'vini',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'vini_hmac',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'pseudo_out',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'pseudo_out_hmac',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'pseudo_out_alpha',
          id: 5
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'spend_key',
          id: 6
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroTransactionInputsPermutationRequest',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'perm',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroTransactionInputsPermutationAck',
      fields: [],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroTransactionInputViniRequest',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'MoneroTransactionSourceEntry',
          name: 'src_entr',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'vini',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'vini_hmac',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'pseudo_out',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'pseudo_out_hmac',
          id: 5
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroTransactionInputViniAck',
      fields: [],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroTransactionAllInputsSetRequest',
      fields: [],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroTransactionAllInputsSetAck',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'MoneroTransactionRsigData',
          name: 'rsig_data',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroTransactionSetOutputRequest',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'MoneroTransactionDestinationEntry',
          name: 'dst_entr',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'dst_entr_hmac',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'MoneroTransactionRsigData',
          name: 'rsig_data',
          id: 3
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroTransactionSetOutputAck',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'tx_out',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'vouti_hmac',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'MoneroTransactionRsigData',
          name: 'rsig_data',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'out_pk',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'ecdh_info',
          id: 5
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroTransactionAllOutSetRequest',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'MoneroTransactionRsigData',
          name: 'rsig_data',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroTransactionAllOutSetAck',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'extra',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'tx_prefix_hash',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'MoneroRingCtSig',
          name: 'rv',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'full_message_hash',
          id: 5
        }
      ],
      enums: [],
      messages: [
        {
          name: 'MoneroRingCtSig',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'txn_fee',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'message',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'rv_type',
              id: 3
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        }
      ],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroTransactionSignInputRequest',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'MoneroTransactionSourceEntry',
          name: 'src_entr',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'vini',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'vini_hmac',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'pseudo_out',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'pseudo_out_hmac',
          id: 5
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'pseudo_out_alpha',
          id: 6
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'spend_key',
          id: 7
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroTransactionSignInputAck',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'signature',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroTransactionFinalRequest',
      fields: [],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroTransactionFinalAck',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'cout_key',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'salt',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'rand_mult',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'tx_enc_keys',
          id: 4
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroKeyImageExportInitRequest',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'uint64',
          name: 'num',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'hash',
          id: 2
        },
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'network_type',
          id: 4
        },
        {
          rule: 'repeated',
          options: {},
          type: 'MoneroSubAddressIndicesList',
          name: 'subs',
          id: 5
        }
      ],
      enums: [],
      messages: [
        {
          name: 'MoneroSubAddressIndicesList',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'account',
              id: 1
            },
            {
              rule: 'repeated',
              options: {},
              type: 'uint32',
              name: 'minor_indices',
              id: 2
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        }
      ],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroKeyImageExportInitAck',
      fields: [],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroKeyImageSyncStepRequest',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'MoneroTransferDetails',
          name: 'tdis',
          id: 1
        }
      ],
      enums: [],
      messages: [
        {
          name: 'MoneroTransferDetails',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'out_key',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'tx_pub_key',
              id: 2
            },
            {
              rule: 'repeated',
              options: {},
              type: 'bytes',
              name: 'additional_tx_pub_keys',
              id: 3
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'internal_output_index',
              id: 4
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        }
      ],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroKeyImageSyncStepAck',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'MoneroExportedKeyImage',
          name: 'kis',
          id: 1
        }
      ],
      enums: [],
      messages: [
        {
          name: 'MoneroExportedKeyImage',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'iv',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'blob',
              id: 3
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        }
      ],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroKeyImageSyncFinalRequest',
      fields: [],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroKeyImageSyncFinalAck',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'enc_key',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroGetTxKeyRequest',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'network_type',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'salt1',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'salt2',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'tx_enc_keys',
          id: 5
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'tx_prefix_hash',
          id: 6
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'reason',
          id: 7
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'view_public_key',
          id: 8
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroGetTxKeyAck',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'salt',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'tx_keys',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'tx_derivations',
          id: 3
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroLiveRefreshStartRequest',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'network_type',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroLiveRefreshStartAck',
      fields: [],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroLiveRefreshStepRequest',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'out_key',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'recv_deriv',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint64',
          name: 'real_out_idx',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'sub_addr_major',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'sub_addr_minor',
          id: 5
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroLiveRefreshStepAck',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'salt',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'key_image',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroLiveRefreshFinalRequest',
      fields: [],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'MoneroLiveRefreshFinalAck',
      fields: [],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'DebugMoneroDiagRequest',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'uint64',
          name: 'ins',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint64',
          name: 'p1',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint64',
          name: 'p2',
          id: 3
        },
        {
          rule: 'repeated',
          options: {},
          type: 'uint64',
          name: 'pd',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'data1',
          id: 5
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'data2',
          id: 6
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'DebugMoneroDiagAck',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'uint64',
          name: 'ins',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint64',
          name: 'p1',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint64',
          name: 'p2',
          id: 3
        },
        {
          rule: 'repeated',
          options: {},
          type: 'uint64',
          name: 'pd',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'data1',
          id: 5
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'data2',
          id: 6
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'NEMGetAddress',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'network',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'show_display',
          id: 3
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'NEMAddress',
      fields: [
        {
          rule: 'required',
          options: {},
          type: 'string',
          name: 'address',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'NEMSignTx',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'NEMTransactionCommon',
          name: 'transaction',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'NEMTransactionCommon',
          name: 'multisig',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'NEMTransfer',
          name: 'transfer',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'cosigning',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'NEMProvisionNamespace',
          name: 'provision_namespace',
          id: 5
        },
        {
          rule: 'optional',
          options: {},
          type: 'NEMMosaicCreation',
          name: 'mosaic_creation',
          id: 6
        },
        {
          rule: 'optional',
          options: {},
          type: 'NEMMosaicSupplyChange',
          name: 'supply_change',
          id: 7
        },
        {
          rule: 'optional',
          options: {},
          type: 'NEMAggregateModification',
          name: 'aggregate_modification',
          id: 8
        },
        {
          rule: 'optional',
          options: {},
          type: 'NEMImportanceTransfer',
          name: 'importance_transfer',
          id: 9
        }
      ],
      enums: [],
      messages: [
        {
          name: 'NEMTransactionCommon',
          fields: [
            {
              rule: 'repeated',
              options: {},
              type: 'uint32',
              name: 'address_n',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'network',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'timestamp',
              id: 3
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'fee',
              id: 4
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'deadline',
              id: 5
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'signer',
              id: 6
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'NEMTransfer',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'string',
              name: 'recipient',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'amount',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'payload',
              id: 3
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'public_key',
              id: 4
            },
            {
              rule: 'repeated',
              options: {},
              type: 'NEMMosaic',
              name: 'mosaics',
              id: 5
            }
          ],
          enums: [],
          messages: [
            {
              name: 'NEMMosaic',
              fields: [
                {
                  rule: 'optional',
                  options: {},
                  type: 'string',
                  name: 'namespace',
                  id: 1
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'string',
                  name: 'mosaic',
                  id: 2
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'uint64',
                  name: 'quantity',
                  id: 3
                }
              ],
              enums: [],
              messages: [],
              options: {},
              oneofs: {}
            }
          ],
          options: {},
          oneofs: {}
        },
        {
          name: 'NEMProvisionNamespace',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'string',
              name: 'namespace',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'string',
              name: 'parent',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'string',
              name: 'sink',
              id: 3
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'fee',
              id: 4
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'NEMMosaicCreation',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'NEMMosaicDefinition',
              name: 'definition',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'string',
              name: 'sink',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'fee',
              id: 3
            }
          ],
          enums: [],
          messages: [
            {
              name: 'NEMMosaicDefinition',
              fields: [
                {
                  rule: 'optional',
                  options: {},
                  type: 'string',
                  name: 'name',
                  id: 1
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'string',
                  name: 'ticker',
                  id: 2
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'string',
                  name: 'namespace',
                  id: 3
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'string',
                  name: 'mosaic',
                  id: 4
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'uint32',
                  name: 'divisibility',
                  id: 5
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'NEMMosaicLevy',
                  name: 'levy',
                  id: 6
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'uint64',
                  name: 'fee',
                  id: 7
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'string',
                  name: 'levy_address',
                  id: 8
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'string',
                  name: 'levy_namespace',
                  id: 9
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'string',
                  name: 'levy_mosaic',
                  id: 10
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'uint64',
                  name: 'supply',
                  id: 11
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'bool',
                  name: 'mutable_supply',
                  id: 12
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'bool',
                  name: 'transferable',
                  id: 13
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'string',
                  name: 'description',
                  id: 14
                },
                {
                  rule: 'repeated',
                  options: {},
                  type: 'uint32',
                  name: 'networks',
                  id: 15
                }
              ],
              enums: [
                {
                  name: 'NEMMosaicLevy',
                  values: [
                    {
                      name: 'MosaicLevy_Absolute',
                      id: 1
                    },
                    {
                      name: 'MosaicLevy_Percentile',
                      id: 2
                    }
                  ],
                  options: {}
                }
              ],
              messages: [],
              options: {},
              oneofs: {}
            }
          ],
          options: {},
          oneofs: {}
        },
        {
          name: 'NEMMosaicSupplyChange',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'string',
              name: 'namespace',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'string',
              name: 'mosaic',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'NEMSupplyChangeType',
              name: 'type',
              id: 3
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'delta',
              id: 4
            }
          ],
          enums: [
            {
              name: 'NEMSupplyChangeType',
              values: [
                {
                  name: 'SupplyChange_Increase',
                  id: 1
                },
                {
                  name: 'SupplyChange_Decrease',
                  id: 2
                }
              ],
              options: {}
            }
          ],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'NEMAggregateModification',
          fields: [
            {
              rule: 'repeated',
              options: {},
              type: 'NEMCosignatoryModification',
              name: 'modifications',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'sint32',
              name: 'relative_change',
              id: 2
            }
          ],
          enums: [],
          messages: [
            {
              name: 'NEMCosignatoryModification',
              fields: [
                {
                  rule: 'optional',
                  options: {},
                  type: 'NEMModificationType',
                  name: 'type',
                  id: 1
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'bytes',
                  name: 'public_key',
                  id: 2
                }
              ],
              enums: [
                {
                  name: 'NEMModificationType',
                  values: [
                    {
                      name: 'CosignatoryModification_Add',
                      id: 1
                    },
                    {
                      name: 'CosignatoryModification_Delete',
                      id: 2
                    }
                  ],
                  options: {}
                }
              ],
              messages: [],
              options: {},
              oneofs: {}
            }
          ],
          options: {},
          oneofs: {}
        },
        {
          name: 'NEMImportanceTransfer',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'NEMImportanceTransferMode',
              name: 'mode',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'public_key',
              id: 2
            }
          ],
          enums: [
            {
              name: 'NEMImportanceTransferMode',
              values: [
                {
                  name: 'ImportanceTransfer_Activate',
                  id: 1
                },
                {
                  name: 'ImportanceTransfer_Deactivate',
                  id: 2
                }
              ],
              options: {}
            }
          ],
          messages: [],
          options: {},
          oneofs: {}
        }
      ],
      options: {},
      oneofs: {}
    },
    {
      name: 'NEMSignedTx',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'data',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'signature',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'NEMDecryptMessage',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'network',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'public_key',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'payload',
          id: 4
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'NEMDecryptedMessage',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'payload',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'OntologyTransaction',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'version',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'type',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'nonce',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint64',
          name: 'gas_price',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint64',
          name: 'gas_limit',
          id: 5
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'payer',
          id: 6
        },
        {
          rule: 'repeated',
          options: {},
          type: 'OntologyTxAttribute',
          name: 'tx_attributes',
          id: 7
        }
      ],
      enums: [],
      messages: [
        {
          name: 'OntologyTxAttribute',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'usage',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'data',
              id: 2
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        }
      ],
      options: {},
      oneofs: {}
    },
    {
      name: 'OntologyGetPublicKey',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'show_display',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'OntologyPublicKey',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'public_key',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'OntologyGetAddress',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'show_display',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'OntologyAddress',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'address',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'OntologySignTransfer',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'OntologyTransaction',
          name: 'transaction',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'OntologyTransfer',
          name: 'transfer',
          id: 3
        }
      ],
      enums: [],
      messages: [
        {
          name: 'OntologyTransfer',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'OntologyAsset',
              name: 'asset',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'amount',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'string',
              name: 'from_address',
              id: 3
            },
            {
              rule: 'optional',
              options: {},
              type: 'string',
              name: 'to_address',
              id: 4
            }
          ],
          enums: [
            {
              name: 'OntologyAsset',
              values: [
                {
                  name: 'ONT',
                  id: 1
                },
                {
                  name: 'ONG',
                  id: 2
                }
              ],
              options: {}
            }
          ],
          messages: [],
          options: {},
          oneofs: {}
        }
      ],
      options: {},
      oneofs: {}
    },
    {
      name: 'OntologySignedTransfer',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'signature',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'payload',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'OntologySignWithdrawOng',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'OntologyTransaction',
          name: 'transaction',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'OntologyWithdrawOng',
          name: 'withdraw_ong',
          id: 3
        }
      ],
      enums: [],
      messages: [
        {
          name: 'OntologyWithdrawOng',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'amount',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'string',
              name: 'from_address',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'string',
              name: 'to_address',
              id: 3
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        }
      ],
      options: {},
      oneofs: {}
    },
    {
      name: 'OntologySignedWithdrawOng',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'signature',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'payload',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'OntologySignOntIdRegister',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'OntologyTransaction',
          name: 'transaction',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'OntologyOntIdRegister',
          name: 'ont_id_register',
          id: 3
        }
      ],
      enums: [],
      messages: [
        {
          name: 'OntologyOntIdRegister',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'string',
              name: 'ont_id',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'public_key',
              id: 2
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        }
      ],
      options: {},
      oneofs: {}
    },
    {
      name: 'OntologySignedOntIdRegister',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'signature',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'payload',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'OntologySignOntIdAddAttributes',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'OntologyTransaction',
          name: 'transaction',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'OntologyOntIdAddAttributes',
          name: 'ont_id_add_attributes',
          id: 3
        }
      ],
      enums: [],
      messages: [
        {
          name: 'OntologyOntIdAddAttributes',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'string',
              name: 'ont_id',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'public_key',
              id: 2
            },
            {
              rule: 'repeated',
              options: {},
              type: 'OntologyOntIdAttribute',
              name: 'ont_id_attributes',
              id: 3
            }
          ],
          enums: [],
          messages: [
            {
              name: 'OntologyOntIdAttribute',
              fields: [
                {
                  rule: 'optional',
                  options: {},
                  type: 'string',
                  name: 'key',
                  id: 1
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'string',
                  name: 'type',
                  id: 2
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'string',
                  name: 'value',
                  id: 3
                }
              ],
              enums: [],
              messages: [],
              options: {},
              oneofs: {}
            }
          ],
          options: {},
          oneofs: {}
        }
      ],
      options: {},
      oneofs: {}
    },
    {
      name: 'OntologySignedOntIdAddAttributes',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'signature',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'payload',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'RippleGetAddress',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'show_display',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'RippleAddress',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'address',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'RippleSignTx',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint64',
          name: 'fee',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'flags',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'sequence',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'last_ledger_sequence',
          id: 5
        },
        {
          rule: 'optional',
          options: {},
          type: 'RipplePayment',
          name: 'payment',
          id: 6
        }
      ],
      enums: [],
      messages: [
        {
          name: 'RipplePayment',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'amount',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'string',
              name: 'destination',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint32',
              name: 'destination_tag',
              id: 3
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        }
      ],
      options: {},
      oneofs: {}
    },
    {
      name: 'RippleSignedTx',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'signature',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'serialized_tx',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'StellarAssetType',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'type',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'code',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'issuer',
          id: 3
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'StellarGetAddress',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'show_display',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'StellarAddress',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'address',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'StellarSignTx',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'network_passphrase',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'source_account',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'fee',
          id: 5
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint64',
          name: 'sequence_number',
          id: 6
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'timebounds_start',
          id: 8
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'timebounds_end',
          id: 9
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'memo_type',
          id: 10
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'memo_text',
          id: 11
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint64',
          name: 'memo_id',
          id: 12
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'memo_hash',
          id: 13
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'num_operations',
          id: 14
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'StellarTxOpRequest',
      fields: [],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'StellarPaymentOp',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'source_account',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'destination_account',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'StellarAssetType',
          name: 'asset',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'sint64',
          name: 'amount',
          id: 4
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'StellarCreateAccountOp',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'source_account',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'new_account',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'sint64',
          name: 'starting_balance',
          id: 3
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'StellarPathPaymentOp',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'source_account',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'StellarAssetType',
          name: 'send_asset',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'sint64',
          name: 'send_max',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'destination_account',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'StellarAssetType',
          name: 'destination_asset',
          id: 5
        },
        {
          rule: 'optional',
          options: {},
          type: 'sint64',
          name: 'destination_amount',
          id: 6
        },
        {
          rule: 'repeated',
          options: {},
          type: 'StellarAssetType',
          name: 'paths',
          id: 7
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'StellarManageOfferOp',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'source_account',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'StellarAssetType',
          name: 'selling_asset',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'StellarAssetType',
          name: 'buying_asset',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'sint64',
          name: 'amount',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'price_n',
          id: 5
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'price_d',
          id: 6
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint64',
          name: 'offer_id',
          id: 7
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'StellarCreatePassiveOfferOp',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'source_account',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'StellarAssetType',
          name: 'selling_asset',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'StellarAssetType',
          name: 'buying_asset',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'sint64',
          name: 'amount',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'price_n',
          id: 5
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'price_d',
          id: 6
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'StellarSetOptionsOp',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'source_account',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'inflation_destination_account',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'clear_flags',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'set_flags',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'master_weight',
          id: 5
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'low_threshold',
          id: 6
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'medium_threshold',
          id: 7
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'high_threshold',
          id: 8
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'home_domain',
          id: 9
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'signer_type',
          id: 10
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'signer_key',
          id: 11
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'signer_weight',
          id: 12
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'StellarChangeTrustOp',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'source_account',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'StellarAssetType',
          name: 'asset',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint64',
          name: 'limit',
          id: 3
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'StellarAllowTrustOp',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'source_account',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'trusted_account',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'asset_type',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'asset_code',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint32',
          name: 'is_authorized',
          id: 5
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'StellarAccountMergeOp',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'source_account',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'destination_account',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'StellarManageDataOp',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'source_account',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'key',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'value',
          id: 3
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'StellarBumpSequenceOp',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'source_account',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint64',
          name: 'bump_to',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'StellarSignedTx',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'public_key',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'signature',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'TezosGetAddress',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'show_display',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'TezosAddress',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'address',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'TezosGetPublicKey',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'show_display',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'TezosPublicKey',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'public_key',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'TezosSignTx',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'branch',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'TezosRevealOp',
          name: 'reveal',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'TezosTransactionOp',
          name: 'transaction',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'TezosOriginationOp',
          name: 'origination',
          id: 5
        },
        {
          rule: 'optional',
          options: {},
          type: 'TezosDelegationOp',
          name: 'delegation',
          id: 6
        }
      ],
      enums: [],
      messages: [
        {
          name: 'TezosContractID',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'TezosContractType',
              name: 'tag',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'hash',
              id: 2
            }
          ],
          enums: [
            {
              name: 'TezosContractType',
              values: [
                {
                  name: 'Implicit',
                  id: 0
                },
                {
                  name: 'Originated',
                  id: 1
                }
              ],
              options: {}
            }
          ],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'TezosRevealOp',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'TezosContractID',
              name: 'source',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'fee',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'counter',
              id: 3
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'gas_limit',
              id: 4
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'storage_limit',
              id: 5
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'public_key',
              id: 6
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'TezosTransactionOp',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'TezosContractID',
              name: 'source',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'fee',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'counter',
              id: 3
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'gas_limit',
              id: 4
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'storage_limit',
              id: 5
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'amount',
              id: 6
            },
            {
              rule: 'optional',
              options: {},
              type: 'TezosContractID',
              name: 'destination',
              id: 7
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'parameters',
              id: 8
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'TezosOriginationOp',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'TezosContractID',
              name: 'source',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'fee',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'counter',
              id: 3
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'gas_limit',
              id: 4
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'storage_limit',
              id: 5
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'manager_pubkey',
              id: 6
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'balance',
              id: 7
            },
            {
              rule: 'optional',
              options: {},
              type: 'bool',
              name: 'spendable',
              id: 8
            },
            {
              rule: 'optional',
              options: {},
              type: 'bool',
              name: 'delegatable',
              id: 9
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'delegate',
              id: 10
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'script',
              id: 11
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        },
        {
          name: 'TezosDelegationOp',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'TezosContractID',
              name: 'source',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'fee',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'counter',
              id: 3
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'gas_limit',
              id: 4
            },
            {
              rule: 'optional',
              options: {},
              type: 'uint64',
              name: 'storage_limit',
              id: 5
            },
            {
              rule: 'optional',
              options: {},
              type: 'bytes',
              name: 'delegate',
              id: 6
            }
          ],
          enums: [],
          messages: [],
          options: {},
          oneofs: {}
        }
      ],
      options: {},
      oneofs: {}
    },
    {
      name: 'TezosSignedTx',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'signature',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'sig_op_contents',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'operation_hash',
          id: 3
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'TronGetAddress',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'show_display',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'TronAddress',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'address',
          id: 1
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      name: 'TronSignTx',
      fields: [
        {
          rule: 'repeated',
          options: {},
          type: 'uint32',
          name: 'address_n',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'ref_block_bytes',
          id: 2
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'ref_block_hash',
          id: 3
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint64',
          name: 'expiration',
          id: 4
        },
        {
          rule: 'optional',
          options: {},
          type: 'string',
          name: 'data',
          id: 5
        },
        {
          rule: 'optional',
          options: {},
          type: 'TronContract',
          name: 'contract',
          id: 6
        },
        {
          rule: 'optional',
          options: {},
          type: 'uint64',
          name: 'timestamp',
          id: 7
        }
      ],
      enums: [],
      messages: [
        {
          name: 'TronContract',
          fields: [
            {
              rule: 'optional',
              options: {},
              type: 'TronTransferContract',
              name: 'transfer_contract',
              id: 1
            },
            {
              rule: 'optional',
              options: {},
              type: 'TronTransferAssetContract',
              name: 'transfer_asset_contract',
              id: 2
            },
            {
              rule: 'optional',
              options: {},
              type: 'TronVoteWitnessContract',
              name: 'vote_witness_contract',
              id: 4
            },
            {
              rule: 'optional',
              options: {},
              type: 'TronWitnessCreateContract',
              name: 'witness_create_contract',
              id: 5
            },
            {
              rule: 'optional',
              options: {},
              type: 'TronAssetIssueContract',
              name: 'asset_issue_contract',
              id: 6
            },
            {
              rule: 'optional',
              options: {},
              type: 'TronWitnessUpdateContract',
              name: 'witness_update_contract',
              id: 8
            },
            {
              rule: 'optional',
              options: {},
              type: 'TronParticipateAssetIssueContract',
              name: 'participate_asset_issue_contract',
              id: 9
            },
            {
              rule: 'optional',
              options: {},
              type: 'TronAccountUpdateContract',
              name: 'account_update_contract',
              id: 10
            },
            {
              rule: 'optional',
              options: {},
              type: 'TronFreezeBalanceContract',
              name: 'freeze_balance_contract',
              id: 11
            },
            {
              rule: 'optional',
              options: {},
              type: 'TronUnfreezeBalanceContract',
              name: 'unfreeze_balance_contract',
              id: 12
            },
            {
              rule: 'optional',
              options: {},
              type: 'TronWithdrawBalanceContract',
              name: 'withdraw_balance_contract',
              id: 13
            },
            {
              rule: 'optional',
              options: {},
              type: 'TronUnfreezeAssetContract',
              name: 'unfreeze_asset_contract',
              id: 14
            },
            {
              rule: 'optional',
              options: {},
              type: 'TronUpdateAssetContract',
              name: 'update_asset_contract',
              id: 15
            },
            {
              rule: 'optional',
              options: {},
              type: 'TronProposalCreateContract',
              name: 'proposal_create_contract',
              id: 16
            },
            {
              rule: 'optional',
              options: {},
              type: 'TronProposalApproveContract',
              name: 'proposal_approve_contract',
              id: 17
            },
            {
              rule: 'optional',
              options: {},
              type: 'TronProposalDeleteContract',
              name: 'proposal_delete_contract',
              id: 18
            }
          ],
          enums: [],
          messages: [
            {
              name: 'TronAccountUpdateContract',
              fields: [
                {
                  rule: 'optional',
                  options: {},
                  type: 'string',
                  name: 'account_name',
                  id: 1
                }
              ],
              enums: [],
              messages: [],
              options: {},
              oneofs: {}
            },
            {
              name: 'TronTransferContract',
              fields: [
                {
                  rule: 'optional',
                  options: {},
                  type: 'bytes',
                  name: 'to_address',
                  id: 1
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'uint64',
                  name: 'amount',
                  id: 2
                }
              ],
              enums: [],
              messages: [],
              options: {},
              oneofs: {}
            },
            {
              name: 'TronTransferAssetContract',
              fields: [
                {
                  rule: 'optional',
                  options: {},
                  type: 'string',
                  name: 'asset_name',
                  id: 1
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'bytes',
                  name: 'to_address',
                  id: 2
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'uint64',
                  name: 'amount',
                  id: 3
                }
              ],
              enums: [],
              messages: [],
              options: {},
              oneofs: {}
            },
            {
              name: 'TronVoteWitnessContract',
              fields: [
                {
                  rule: 'repeated',
                  options: {},
                  type: 'TronVote',
                  name: 'votes',
                  id: 1
                }
              ],
              enums: [],
              messages: [
                {
                  name: 'TronVote',
                  fields: [
                    {
                      rule: 'optional',
                      options: {},
                      type: 'bytes',
                      name: 'vote_address',
                      id: 1
                    },
                    {
                      rule: 'optional',
                      options: {},
                      type: 'uint64',
                      name: 'vote_count',
                      id: 2
                    }
                  ],
                  enums: [],
                  messages: [],
                  options: {},
                  oneofs: {}
                }
              ],
              options: {},
              oneofs: {}
            },
            {
              name: 'TronWitnessCreateContract',
              fields: [
                {
                  rule: 'optional',
                  options: {},
                  type: 'string',
                  name: 'url',
                  id: 1
                }
              ],
              enums: [],
              messages: [],
              options: {},
              oneofs: {}
            },
            {
              name: 'TronWitnessUpdateContract',
              fields: [
                {
                  rule: 'optional',
                  options: {},
                  type: 'string',
                  name: 'update_url',
                  id: 2
                }
              ],
              enums: [],
              messages: [],
              options: {},
              oneofs: {}
            },
            {
              name: 'TronAssetIssueContract',
              fields: [
                {
                  rule: 'optional',
                  options: {},
                  type: 'string',
                  name: 'name',
                  id: 2
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'string',
                  name: 'abbr',
                  id: 3
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'uint64',
                  name: 'total_supply',
                  id: 4
                },
                {
                  rule: 'repeated',
                  options: {},
                  type: 'TronFrozenSupply',
                  name: 'frozen_supply',
                  id: 5
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'uint32',
                  name: 'trx_num',
                  id: 6
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'uint32',
                  name: 'num',
                  id: 7
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'uint64',
                  name: 'start_time',
                  id: 8
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'uint64',
                  name: 'end_time',
                  id: 9
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'string',
                  name: 'description',
                  id: 10
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'string',
                  name: 'url',
                  id: 11
                }
              ],
              enums: [],
              messages: [
                {
                  name: 'TronFrozenSupply',
                  fields: [
                    {
                      rule: 'optional',
                      options: {},
                      type: 'uint64',
                      name: 'frozen_amount',
                      id: 1
                    },
                    {
                      rule: 'optional',
                      options: {},
                      type: 'uint64',
                      name: 'frozen_days',
                      id: 2
                    }
                  ],
                  enums: [],
                  messages: [],
                  options: {},
                  oneofs: {}
                }
              ],
              options: {},
              oneofs: {}
            },
            {
              name: 'TronParticipateAssetIssueContract',
              fields: [
                {
                  rule: 'optional',
                  options: {},
                  type: 'bytes',
                  name: 'to_address',
                  id: 1
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'string',
                  name: 'asset_name',
                  id: 2
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'uint64',
                  name: 'amount',
                  id: 3
                }
              ],
              enums: [],
              messages: [],
              options: {},
              oneofs: {}
            },
            {
              name: 'TronFreezeBalanceContract',
              fields: [
                {
                  rule: 'optional',
                  options: {},
                  type: 'uint64',
                  name: 'frozen_balance',
                  id: 1
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'uint64',
                  name: 'frozen_duration',
                  id: 2
                }
              ],
              enums: [],
              messages: [],
              options: {},
              oneofs: {}
            },
            {
              name: 'TronUnfreezeBalanceContract',
              fields: [],
              enums: [],
              messages: [],
              options: {},
              oneofs: {}
            },
            {
              name: 'TronUnfreezeAssetContract',
              fields: [],
              enums: [],
              messages: [],
              options: {},
              oneofs: {}
            },
            {
              name: 'TronWithdrawBalanceContract',
              fields: [],
              enums: [],
              messages: [],
              options: {},
              oneofs: {}
            },
            {
              name: 'TronUpdateAssetContract',
              fields: [
                {
                  rule: 'optional',
                  options: {},
                  type: 'string',
                  name: 'description',
                  id: 1
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'string',
                  name: 'url',
                  id: 2
                }
              ],
              enums: [],
              messages: [],
              options: {},
              oneofs: {}
            },
            {
              name: 'TronProposalCreateContract',
              fields: [
                {
                  rule: 'repeated',
                  options: {},
                  type: 'TronProposalParameters',
                  name: 'parameters',
                  id: 1
                }
              ],
              enums: [],
              messages: [
                {
                  name: 'TronProposalParameters',
                  fields: [
                    {
                      rule: 'optional',
                      options: {},
                      type: 'uint64',
                      name: 'key',
                      id: 1
                    },
                    {
                      rule: 'optional',
                      options: {},
                      type: 'uint64',
                      name: 'value',
                      id: 2
                    }
                  ],
                  enums: [],
                  messages: [],
                  options: {},
                  oneofs: {}
                }
              ],
              options: {},
              oneofs: {}
            },
            {
              name: 'TronProposalApproveContract',
              fields: [
                {
                  rule: 'optional',
                  options: {},
                  type: 'uint64',
                  name: 'proposal_id',
                  id: 1
                },
                {
                  rule: 'optional',
                  options: {},
                  type: 'bool',
                  name: 'is_add_approval',
                  id: 2
                }
              ],
              enums: [],
              messages: [],
              options: {},
              oneofs: {}
            },
            {
              name: 'TronProposalDeleteContract',
              fields: [
                {
                  rule: 'optional',
                  options: {},
                  type: 'uint64',
                  name: 'proposal_id',
                  id: 1
                }
              ],
              enums: [],
              messages: [],
              options: {},
              oneofs: {}
            }
          ],
          options: {},
          oneofs: {}
        }
      ],
      options: {},
      oneofs: {}
    },
    {
      name: 'TronSignedTx',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'signature',
          id: 1
        },
        {
          rule: 'optional',
          options: {},
          type: 'bytes',
          name: 'serialized_tx',
          id: 2
        }
      ],
      enums: [],
      messages: [],
      options: {},
      oneofs: {}
    },
    {
      ref: 'google.protobuf.EnumValueOptions',
      fields: [
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'wire_in',
          id: 50002
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'wire_out',
          id: 50003
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'wire_debug_in',
          id: 50004
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'wire_debug_out',
          id: 50005
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'wire_tiny',
          id: 50006
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'wire_bootloader',
          id: 50007
        },
        {
          rule: 'optional',
          options: {},
          type: 'bool',
          name: 'wire_no_fsm',
          id: 50008
        }
      ]
    }
  ],
  enums: [
    {
      name: 'InputScriptType',
      values: [
        {
          name: 'SPENDADDRESS',
          id: 0
        },
        {
          name: 'SPENDMULTISIG',
          id: 1
        },
        {
          name: 'EXTERNAL',
          id: 2
        },
        {
          name: 'SPENDWITNESS',
          id: 3
        },
        {
          name: 'SPENDP2SHWITNESS',
          id: 4
        }
      ],
      options: {}
    },
    {
      name: 'MessageType',
      values: [
        {
          name: 'MessageType_Initialize',
          id: 0
        },
        {
          name: 'MessageType_Ping',
          id: 1
        },
        {
          name: 'MessageType_Success',
          id: 2
        },
        {
          name: 'MessageType_Failure',
          id: 3
        },
        {
          name: 'MessageType_ChangePin',
          id: 4
        },
        {
          name: 'MessageType_WipeDevice',
          id: 5
        },
        {
          name: 'MessageType_GetEntropy',
          id: 9
        },
        {
          name: 'MessageType_Entropy',
          id: 10
        },
        {
          name: 'MessageType_LoadDevice',
          id: 13
        },
        {
          name: 'MessageType_ResetDevice',
          id: 14
        },
        {
          name: 'MessageType_Features',
          id: 17
        },
        {
          name: 'MessageType_PinMatrixRequest',
          id: 18
        },
        {
          name: 'MessageType_PinMatrixAck',
          id: 19
        },
        {
          name: 'MessageType_Cancel',
          id: 20
        },
        {
          name: 'MessageType_ClearSession',
          id: 24
        },
        {
          name: 'MessageType_ApplySettings',
          id: 25
        },
        {
          name: 'MessageType_ButtonRequest',
          id: 26
        },
        {
          name: 'MessageType_ButtonAck',
          id: 27
        },
        {
          name: 'MessageType_ApplyFlags',
          id: 28
        },
        {
          name: 'MessageType_BackupDevice',
          id: 34
        },
        {
          name: 'MessageType_EntropyRequest',
          id: 35
        },
        {
          name: 'MessageType_EntropyAck',
          id: 36
        },
        {
          name: 'MessageType_PassphraseRequest',
          id: 41
        },
        {
          name: 'MessageType_PassphraseAck',
          id: 42
        },
        {
          name: 'MessageType_PassphraseStateRequest',
          id: 77
        },
        {
          name: 'MessageType_PassphraseStateAck',
          id: 78
        },
        {
          name: 'MessageType_RecoveryDevice',
          id: 45
        },
        {
          name: 'MessageType_WordRequest',
          id: 46
        },
        {
          name: 'MessageType_WordAck',
          id: 47
        },
        {
          name: 'MessageType_GetFeatures',
          id: 55
        },
        {
          name: 'MessageType_SetU2FCounter',
          id: 63
        },
        {
          name: 'MessageType_FirmwareErase',
          id: 6
        },
        {
          name: 'MessageType_FirmwareUpload',
          id: 7
        },
        {
          name: 'MessageType_FirmwareRequest',
          id: 8
        },
        {
          name: 'MessageType_SelfTest',
          id: 32
        },
        {
          name: 'MessageType_GetPublicKey',
          id: 11
        },
        {
          name: 'MessageType_PublicKey',
          id: 12
        },
        {
          name: 'MessageType_SignTx',
          id: 15
        },
        {
          name: 'MessageType_TxRequest',
          id: 21
        },
        {
          name: 'MessageType_TxAck',
          id: 22
        },
        {
          name: 'MessageType_GetAddress',
          id: 29
        },
        {
          name: 'MessageType_Address',
          id: 30
        },
        {
          name: 'MessageType_SignMessage',
          id: 38
        },
        {
          name: 'MessageType_VerifyMessage',
          id: 39
        },
        {
          name: 'MessageType_MessageSignature',
          id: 40
        },
        {
          name: 'MessageType_CipherKeyValue',
          id: 23
        },
        {
          name: 'MessageType_CipheredKeyValue',
          id: 48
        },
        {
          name: 'MessageType_SignIdentity',
          id: 53
        },
        {
          name: 'MessageType_SignedIdentity',
          id: 54
        },
        {
          name: 'MessageType_GetECDHSessionKey',
          id: 61
        },
        {
          name: 'MessageType_ECDHSessionKey',
          id: 62
        },
        {
          name: 'MessageType_CosiCommit',
          id: 71
        },
        {
          name: 'MessageType_CosiCommitment',
          id: 72
        },
        {
          name: 'MessageType_CosiSign',
          id: 73
        },
        {
          name: 'MessageType_CosiSignature',
          id: 74
        },
        {
          name: 'MessageType_DebugLinkDecision',
          id: 100
        },
        {
          name: 'MessageType_DebugLinkGetState',
          id: 101
        },
        {
          name: 'MessageType_DebugLinkState',
          id: 102
        },
        {
          name: 'MessageType_DebugLinkStop',
          id: 103
        },
        {
          name: 'MessageType_DebugLinkLog',
          id: 104
        },
        {
          name: 'MessageType_DebugLinkMemoryRead',
          id: 110
        },
        {
          name: 'MessageType_DebugLinkMemory',
          id: 111
        },
        {
          name: 'MessageType_DebugLinkMemoryWrite',
          id: 112
        },
        {
          name: 'MessageType_DebugLinkFlashErase',
          id: 113
        },
        {
          name: 'MessageType_EthereumGetPublicKey',
          id: 450
        },
        {
          name: 'MessageType_EthereumPublicKey',
          id: 451
        },
        {
          name: 'MessageType_EthereumGetAddress',
          id: 56
        },
        {
          name: 'MessageType_EthereumAddress',
          id: 57
        },
        {
          name: 'MessageType_EthereumSignTx',
          id: 58
        },
        {
          name: 'MessageType_EthereumTxRequest',
          id: 59
        },
        {
          name: 'MessageType_EthereumTxAck',
          id: 60
        },
        {
          name: 'MessageType_EthereumSignMessage',
          id: 64
        },
        {
          name: 'MessageType_EthereumVerifyMessage',
          id: 65
        },
        {
          name: 'MessageType_EthereumMessageSignature',
          id: 66
        },
        {
          name: 'MessageType_NEMGetAddress',
          id: 67
        },
        {
          name: 'MessageType_NEMAddress',
          id: 68
        },
        {
          name: 'MessageType_NEMSignTx',
          id: 69
        },
        {
          name: 'MessageType_NEMSignedTx',
          id: 70
        },
        {
          name: 'MessageType_NEMDecryptMessage',
          id: 75
        },
        {
          name: 'MessageType_NEMDecryptedMessage',
          id: 76
        },
        {
          name: 'MessageType_LiskGetAddress',
          id: 114
        },
        {
          name: 'MessageType_LiskAddress',
          id: 115
        },
        {
          name: 'MessageType_LiskSignTx',
          id: 116
        },
        {
          name: 'MessageType_LiskSignedTx',
          id: 117
        },
        {
          name: 'MessageType_LiskSignMessage',
          id: 118
        },
        {
          name: 'MessageType_LiskMessageSignature',
          id: 119
        },
        {
          name: 'MessageType_LiskVerifyMessage',
          id: 120
        },
        {
          name: 'MessageType_LiskGetPublicKey',
          id: 121
        },
        {
          name: 'MessageType_LiskPublicKey',
          id: 122
        },
        {
          name: 'MessageType_TezosGetAddress',
          id: 150
        },
        {
          name: 'MessageType_TezosAddress',
          id: 151
        },
        {
          name: 'MessageType_TezosSignTx',
          id: 152
        },
        {
          name: 'MessageType_TezosSignedTx',
          id: 153
        },
        {
          name: 'MessageType_TezosGetPublicKey',
          id: 154
        },
        {
          name: 'MessageType_TezosPublicKey',
          id: 155
        },
        {
          name: 'MessageType_StellarSignTx',
          id: 202
        },
        {
          name: 'MessageType_StellarTxOpRequest',
          id: 203
        },
        {
          name: 'MessageType_StellarGetAddress',
          id: 207
        },
        {
          name: 'MessageType_StellarAddress',
          id: 208
        },
        {
          name: 'MessageType_StellarCreateAccountOp',
          id: 210
        },
        {
          name: 'MessageType_StellarPaymentOp',
          id: 211
        },
        {
          name: 'MessageType_StellarPathPaymentOp',
          id: 212
        },
        {
          name: 'MessageType_StellarManageOfferOp',
          id: 213
        },
        {
          name: 'MessageType_StellarCreatePassiveOfferOp',
          id: 214
        },
        {
          name: 'MessageType_StellarSetOptionsOp',
          id: 215
        },
        {
          name: 'MessageType_StellarChangeTrustOp',
          id: 216
        },
        {
          name: 'MessageType_StellarAllowTrustOp',
          id: 217
        },
        {
          name: 'MessageType_StellarAccountMergeOp',
          id: 218
        },
        {
          name: 'MessageType_StellarManageDataOp',
          id: 220
        },
        {
          name: 'MessageType_StellarBumpSequenceOp',
          id: 221
        },
        {
          name: 'MessageType_StellarSignedTx',
          id: 230
        },
        {
          name: 'MessageType_TronGetAddress',
          id: 250
        },
        {
          name: 'MessageType_TronAddress',
          id: 251
        },
        {
          name: 'MessageType_TronSignTx',
          id: 252
        },
        {
          name: 'MessageType_TronSignedTx',
          id: 253
        },
        {
          name: 'MessageType_CardanoSignTx',
          id: 303
        },
        {
          name: 'MessageType_CardanoTxRequest',
          id: 304
        },
        {
          name: 'MessageType_CardanoGetPublicKey',
          id: 305
        },
        {
          name: 'MessageType_CardanoPublicKey',
          id: 306
        },
        {
          name: 'MessageType_CardanoGetAddress',
          id: 307
        },
        {
          name: 'MessageType_CardanoAddress',
          id: 308
        },
        {
          name: 'MessageType_CardanoTxAck',
          id: 309
        },
        {
          name: 'MessageType_CardanoSignedTx',
          id: 310
        },
        {
          name: 'MessageType_OntologyGetAddress',
          id: 350
        },
        {
          name: 'MessageType_OntologyAddress',
          id: 351
        },
        {
          name: 'MessageType_OntologyGetPublicKey',
          id: 352
        },
        {
          name: 'MessageType_OntologyPublicKey',
          id: 353
        },
        {
          name: 'MessageType_OntologySignTransfer',
          id: 354
        },
        {
          name: 'MessageType_OntologySignedTransfer',
          id: 355
        },
        {
          name: 'MessageType_OntologySignWithdrawOng',
          id: 356
        },
        {
          name: 'MessageType_OntologySignedWithdrawOng',
          id: 357
        },
        {
          name: 'MessageType_OntologySignOntIdRegister',
          id: 358
        },
        {
          name: 'MessageType_OntologySignedOntIdRegister',
          id: 359
        },
        {
          name: 'MessageType_OntologySignOntIdAddAttributes',
          id: 360
        },
        {
          name: 'MessageType_OntologySignedOntIdAddAttributes',
          id: 361
        },
        {
          name: 'MessageType_RippleGetAddress',
          id: 400
        },
        {
          name: 'MessageType_RippleAddress',
          id: 401
        },
        {
          name: 'MessageType_RippleSignTx',
          id: 402
        },
        {
          name: 'MessageType_RippleSignedTx',
          id: 403
        },
        {
          name: 'MessageType_MoneroTransactionInitRequest',
          id: 501
        },
        {
          name: 'MessageType_MoneroTransactionInitAck',
          id: 502
        },
        {
          name: 'MessageType_MoneroTransactionSetInputRequest',
          id: 503
        },
        {
          name: 'MessageType_MoneroTransactionSetInputAck',
          id: 504
        },
        {
          name: 'MessageType_MoneroTransactionInputsPermutationRequest',
          id: 505
        },
        {
          name: 'MessageType_MoneroTransactionInputsPermutationAck',
          id: 506
        },
        {
          name: 'MessageType_MoneroTransactionInputViniRequest',
          id: 507
        },
        {
          name: 'MessageType_MoneroTransactionInputViniAck',
          id: 508
        },
        {
          name: 'MessageType_MoneroTransactionAllInputsSetRequest',
          id: 509
        },
        {
          name: 'MessageType_MoneroTransactionAllInputsSetAck',
          id: 510
        },
        {
          name: 'MessageType_MoneroTransactionSetOutputRequest',
          id: 511
        },
        {
          name: 'MessageType_MoneroTransactionSetOutputAck',
          id: 512
        },
        {
          name: 'MessageType_MoneroTransactionAllOutSetRequest',
          id: 513
        },
        {
          name: 'MessageType_MoneroTransactionAllOutSetAck',
          id: 514
        },
        {
          name: 'MessageType_MoneroTransactionSignInputRequest',
          id: 515
        },
        {
          name: 'MessageType_MoneroTransactionSignInputAck',
          id: 516
        },
        {
          name: 'MessageType_MoneroTransactionFinalRequest',
          id: 517
        },
        {
          name: 'MessageType_MoneroTransactionFinalAck',
          id: 518
        },
        {
          name: 'MessageType_MoneroKeyImageExportInitRequest',
          id: 530
        },
        {
          name: 'MessageType_MoneroKeyImageExportInitAck',
          id: 531
        },
        {
          name: 'MessageType_MoneroKeyImageSyncStepRequest',
          id: 532
        },
        {
          name: 'MessageType_MoneroKeyImageSyncStepAck',
          id: 533
        },
        {
          name: 'MessageType_MoneroKeyImageSyncFinalRequest',
          id: 534
        },
        {
          name: 'MessageType_MoneroKeyImageSyncFinalAck',
          id: 535
        },
        {
          name: 'MessageType_MoneroGetAddress',
          id: 540
        },
        {
          name: 'MessageType_MoneroAddress',
          id: 541
        },
        {
          name: 'MessageType_MoneroGetWatchKey',
          id: 542
        },
        {
          name: 'MessageType_MoneroWatchKey',
          id: 543
        },
        {
          name: 'MessageType_DebugMoneroDiagRequest',
          id: 546
        },
        {
          name: 'MessageType_DebugMoneroDiagAck',
          id: 547
        },
        {
          name: 'MessageType_MoneroGetTxKeyRequest',
          id: 550
        },
        {
          name: 'MessageType_MoneroGetTxKeyAck',
          id: 551
        },
        {
          name: 'MessageType_MoneroLiveRefreshStartRequest',
          id: 552
        },
        {
          name: 'MessageType_MoneroLiveRefreshStartAck',
          id: 553
        },
        {
          name: 'MessageType_MoneroLiveRefreshStepRequest',
          id: 554
        },
        {
          name: 'MessageType_MoneroLiveRefreshStepAck',
          id: 555
        },
        {
          name: 'MessageType_MoneroLiveRefreshFinalRequest',
          id: 556
        },
        {
          name: 'MessageType_MoneroLiveRefreshFinalAck',
          id: 557
        },
        {
          name: 'MessageType_EosGetPublicKey',
          id: 600
        },
        {
          name: 'MessageType_EosPublicKey',
          id: 601
        },
        {
          name: 'MessageType_EosSignTx',
          id: 602
        },
        {
          name: 'MessageType_EosTxActionRequest',
          id: 603
        },
        {
          name: 'MessageType_EosTxActionAck',
          id: 604
        },
        {
          name: 'MessageType_EosSignedTx',
          id: 605
        }
      ],
      options: {}
    }
  ],
  imports: [],
  options: {},
  services: []
});

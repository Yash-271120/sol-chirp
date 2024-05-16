/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/sol_chirp.json`.
 */
export type SolChirp = {
  "address": "H26sRLnKwFvYM4pAe8mhLtnHaAqndNQpGEmpbrmmVhj8",
  "metadata": {
    "name": "solChirp",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createLike",
      "discriminator": [
        211,
        47,
        253,
        78,
        254,
        205,
        32,
        184
      ],
      "accounts": [
        {
          "name": "likeMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  107,
                  101,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "likeAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  107,
                  101,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "likeMint"
              }
            ]
          }
        },
        {
          "name": "authorTokenAccount",
          "writable": true
        },
        {
          "name": "like",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "submitterProfile"
              },
              {
                "kind": "account",
                "path": "tweet"
              }
            ]
          }
        },
        {
          "name": "tweet",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  119,
                  101,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "tweet.profile_pubkey",
                "account": "solanaTweet"
              },
              {
                "kind": "account",
                "path": "tweet.tweet_number",
                "account": "solanaTweet"
              }
            ]
          }
        },
        {
          "name": "submitterProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "submitterProfile"
          ]
        },
        {
          "name": "authorWallet"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "createLikeMint",
      "discriminator": [
        213,
        254,
        11,
        60,
        177,
        146,
        170,
        100
      ],
      "accounts": [
        {
          "name": "likeMetadata",
          "writable": true
        },
        {
          "name": "likeMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  107,
                  101,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "likeAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  107,
                  101,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "likeMint"
              }
            ]
          }
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "tokenMetadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        }
      ],
      "args": []
    },
    {
      "name": "createProfile",
      "discriminator": [
        225,
        205,
        234,
        143,
        17,
        186,
        50,
        220
      ],
      "accounts": [
        {
          "name": "profile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "handle",
          "type": "string"
        },
        {
          "name": "displayName",
          "type": "string"
        }
      ]
    },
    {
      "name": "createProfileAtas",
      "discriminator": [
        66,
        150,
        242,
        62,
        49,
        193,
        125,
        26
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "likeMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  107,
                  101,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "likeAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  107,
                  101,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "likeMint"
              }
            ]
          }
        },
        {
          "name": "likeTokenAccount",
          "writable": true
        },
        {
          "name": "retweetMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  116,
                  119,
                  101,
                  101,
                  116,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "retweetAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  116,
                  119,
                  101,
                  101,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "retweetMint"
              }
            ]
          }
        },
        {
          "name": "retweetTokenAccount",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "createRetweet",
      "discriminator": [
        77,
        161,
        163,
        138,
        213,
        213,
        82,
        204
      ],
      "accounts": [
        {
          "name": "retweetMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  116,
                  119,
                  101,
                  101,
                  116,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "retweetAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  116,
                  119,
                  101,
                  101,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "retweetMint"
              }
            ]
          }
        },
        {
          "name": "authorTokenAccount",
          "writable": true
        },
        {
          "name": "tweet",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  119,
                  101,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "tweet.profile_pubkey",
                "account": "solanaTweet"
              },
              {
                "kind": "account",
                "path": "tweet.tweet_number",
                "account": "solanaTweet"
              }
            ]
          }
        },
        {
          "name": "retweet",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  116,
                  119,
                  101,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "submitterProfile"
              },
              {
                "kind": "account",
                "path": "tweet"
              }
            ]
          }
        },
        {
          "name": "submitterProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "submitterProfile"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "authorWallet"
        }
      ],
      "args": []
    },
    {
      "name": "createRetweetMint",
      "discriminator": [
        144,
        103,
        54,
        26,
        119,
        196,
        104,
        83
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "tokenMetadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          "name": "retweetMetadata",
          "writable": true
        },
        {
          "name": "retweetMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  116,
                  119,
                  101,
                  101,
                  116,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "retweetAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  116,
                  119,
                  101,
                  101,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "retweetMint"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "createTweet",
      "discriminator": [
        240,
        129,
        89,
        200,
        95,
        152,
        63,
        70
      ],
      "accounts": [
        {
          "name": "tweet",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  119,
                  101,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "profile"
              },
              {
                "kind": "account",
                "path": "profile.tweet_count.add(1)",
                "account": "solChirpProfile"
              }
            ]
          }
        },
        {
          "name": "profile",
          "docs": [
            "Check"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "profile"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "body",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "likeMintAuthorityPda",
      "discriminator": [
        7,
        89,
        182,
        44,
        114,
        106,
        100,
        37
      ]
    },
    {
      "name": "retweetMintAuthorityPda",
      "discriminator": [
        118,
        105,
        78,
        28,
        177,
        24,
        121,
        238
      ]
    },
    {
      "name": "solChirpProfile",
      "discriminator": [
        228,
        146,
        149,
        67,
        31,
        214,
        133,
        212
      ]
    },
    {
      "name": "solanaLike",
      "discriminator": [
        182,
        110,
        204,
        37,
        60,
        47,
        159,
        90
      ]
    },
    {
      "name": "solanaRetweet",
      "discriminator": [
        6,
        5,
        232,
        5,
        10,
        3,
        184,
        249
      ]
    },
    {
      "name": "solanaTweet",
      "discriminator": [
        130,
        11,
        145,
        71,
        37,
        201,
        55,
        103
      ]
    }
  ],
  "types": [
    {
      "name": "likeMintAuthorityPda",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "mintBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "retweetMintAuthorityPda",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "mintBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "solChirpProfile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "tweetCount",
            "type": "u32"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "handle",
            "type": "string"
          },
          {
            "name": "displayName",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "solanaLike",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "walletPubkey",
            "type": "pubkey"
          },
          {
            "name": "profilePubkey",
            "type": "pubkey"
          },
          {
            "name": "tweetPubkey",
            "type": "pubkey"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "solanaRetweet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "walletPubkey",
            "type": "pubkey"
          },
          {
            "name": "profilePubkey",
            "type": "pubkey"
          },
          {
            "name": "tweetPubkey",
            "type": "pubkey"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "solanaTweet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "walletPubkey",
            "type": "pubkey"
          },
          {
            "name": "profilePubkey",
            "type": "pubkey"
          },
          {
            "name": "tweetNumber",
            "type": "u32"
          },
          {
            "name": "likeCount",
            "type": "u32"
          },
          {
            "name": "retweetCount",
            "type": "u32"
          },
          {
            "name": "body",
            "type": "string"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};

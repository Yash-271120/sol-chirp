import * as anchor from "@coral-xyz/anchor";
import { MPL_TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { Program } from "@coral-xyz/anchor";
import { SolChirp } from "../target/types/sol_chirp";
import fs from "fs";

const wallet = new anchor.Wallet(
  anchor.web3.Keypair.fromSecretKey(
    Uint8Array.from([
      212, 21, 64, 69, 19, 166, 63, 72, 196, 168, 102, 63, 13, 150, 112, 233,
      166, 90, 63, 28, 214, 227, 127, 162, 61, 173, 251, 250, 132, 41, 58, 86,
      177, 63, 42, 212, 254, 206, 216, 187, 173, 47, 102, 67, 30, 9, 211, 99,
      43, 51, 67, 118, 243, 141, 215, 35, 80, 71, 163, 20, 230, 31, 237, 222,
    ])
  )
);

const METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  MPL_TOKEN_METADATA_PROGRAM_ID
);

const connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl("devnet"));

describe("sol-chirp", async () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.SolChirp as Program<SolChirp>;

  const [likeMint] = await anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("like_mint")],
    program.programId
  );

  const [likeMintAuthority] =
    await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("like_authority"), likeMint.toBuffer()],
      program.programId
    );

  const [likeMetadata] = await anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      METADATA_PROGRAM_ID.toBuffer(),
      likeMint.toBuffer(),
    ],
    METADATA_PROGRAM_ID
  );

  it("Is like mint initialized!", async () => {
    // const likeTr = await program.methods
    //   .createLikeMint()
    //   .accounts({
    //     likeMetadata,
    //     payer: wallet.publicKey,
    //   })
    //   .rpc().catch(e => console.error(e));

    // // const sig = await anchor.web3.sendAndConfirmTransaction(
    // //   connection,
    // //   likeTr,
    // //   [wallet.payer]
    // // );

    // console.log("Like mint initialized with signature: ",likeTr);

    const data = await connection.getAccountInfo(likeMetadata);

    console.log("Like mint data: ", data);

    //parse account data to get metadata

    const obj = JSON.parse(data?.data.toString() as string);

    console.log("Like mint metadata: ", obj);
  });
});

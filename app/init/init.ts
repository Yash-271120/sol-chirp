import * as anchor from "@coral-xyz/anchor";
import * as constants from "../src/utils/const";
import * as dotenv from "dotenv";
import fs from "fs";
import { SeedUtil } from "../src/utils/seed-utils";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import IDL from "../src/utils/idl/sol_chirp.json";
import { SolChirp } from "../src/types/sol_chirp";

export async function createMints(
  masterWallet: AnchorWallet
): Promise<[anchor.web3.Transaction, anchor.AnchorProvider]> {
  const provider = new anchor.AnchorProvider(
    new anchor.web3.Connection(
      process.env.RPC_ENDPOINT as string,
      constants.PREFLIGHT_COMMITMENT
    ),
    masterWallet,
    {
      preflightCommitment: constants.PREFLIGHT_COMMITMENT,
    }
  );

  const program = new anchor.Program(IDL as SolChirp, provider);

  const seedUtil = new SeedUtil(program, masterWallet.publicKey);

  if (!provider) throw "Provider is null";

  const likeMintIx = await program.methods
    .createLikeMint()
    .accounts({
      likeMetadata: seedUtil.likeMetadataPda,
      payer: provider.wallet.publicKey,
    })
    .instruction();

  const retweetMintIx = await program.methods
    .createRetweetMint()
    .accounts({
      retweetMetadata: seedUtil.retweetMetadataPda,
      payer: provider.wallet.publicKey,
    })
    .instruction();

  let tx = new anchor.web3.Transaction().add(likeMintIx).add(retweetMintIx);

  return [tx, provider];
}

async function main() {
  dotenv.config();

  const MASTER_WALLET: anchor.Wallet = new anchor.Wallet(
    anchor.web3.Keypair.fromSecretKey(
      Buffer.from(
        JSON.parse(
          fs.readFileSync(__dirname + "/../wallet/master.json", "utf-8")
        )
      )
    )
  );

  const connection: anchor.web3.Connection = new anchor.web3.Connection(
    process.env.RPC_ENDPOINT as string,
    constants.PREFLIGHT_COMMITMENT
  );

  console.log("Creating new mints for likes and retweets...");

  try {
    const [tx] = await createMints(MASTER_WALLET);
    await anchor.web3.sendAndConfirmTransaction(connection, tx, [
      MASTER_WALLET.payer,
    ]);
    console.log("Mints created successfully!");
  } catch (error) {
    console.log(error);
    console.log("Mints already exists!");
  }
}

main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);

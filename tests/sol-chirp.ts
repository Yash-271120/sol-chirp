import * as anchor from "@coral-xyz/anchor";
import { MPL_TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { Program } from "@coral-xyz/anchor";
import { SolChirp } from "../target/types/sol_chirp";
import * as constants from "../app/src/utils/const";
import { SeedUtil } from "../app/src/utils/seed-utils";
import * as util from "../app/src/utils/util";
import fs from "fs";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const MASTER_WALLET = new anchor.Wallet(
  anchor.web3.Keypair.fromSecretKey(
    Buffer.from(
      JSON.parse(fs.readFileSync(__dirname + "/../wallet/master.json", "utf-8"))
    )
  )
);

const METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  MPL_TOKEN_METADATA_PROGRAM_ID
);

const connection: anchor.web3.Connection = new anchor.web3.Connection(
  anchor.web3.clusterApiUrl("devnet")
);
let provider: anchor.AnchorProvider;
let program: anchor.Program<SolChirp>;
let seedUtil: SeedUtil;

let testWallet1: anchor.Wallet;
let testWallet1ProfilePda: anchor.web3.PublicKey;
let testWallet1TweetPda: anchor.web3.PublicKey;
const testHandle1: string = "realYash";
const testDisplayName1: string = "Yash Patil";

let testWallet2: anchor.Wallet;
let testWallet2ProfilePda: anchor.web3.PublicKey;
const testHandle2: string = "Johnifts";
const testDisplayName2: string = "John Doe";

describe("SolChirp Anchor tests", async () => {
  it("create the Like & Retweet mints", async () => {
    await anchor.web3.sendAndConfirmTransaction(
      connection,
      await util.createMintsTransaction(MASTER_WALLET),
      [MASTER_WALLET.payer]
    );
  });

  it("Prepare a new user wallet for testing", async () => {
    testWallet1 = await primeNewWallet("Test Wallet");
    [provider, program, seedUtil] = await util.getAnchorConfigs(testWallet1);
    testWallet1ProfilePda = seedUtil.profilePda;
  });

  it("Create new profile", async () => {
    await anchor.web3.sendAndConfirmTransaction(
      connection,
      await util.createProfileTransaction(
        testWallet1,
        testHandle1,
        testDisplayName1
      ),
      [testWallet1.payer]
    );
  });

  it("create profile ata", async () => {
    await anchor.web3.sendAndConfirmTransaction(
      connection,
      await util.createProfileATATransaction(testWallet1),
      [testWallet1.payer]
    );
  });

  it("Write a tweet (1/4)", async () => {
    await writeTweet("Hello everybody");
  });
  it("Write a tweet (2/4)", async () => {
    await writeTweet("Yoooo sup!");
  });
  it("Write a tweet (3/4)", async () => {
    await writeTweet("Peace everybody :)");
  });
  it("Write a tweet (4/4)", async () => {
    await writeTweet("Goodbye");
  });

  it("prints a tweet", async () => {
    await printTweet(testWallet1TweetPda);
  });

  it("Prepare a second user wallet for testing", async () => {
    testWallet2 = await primeNewWallet("Test Wallet");
    [provider, program, seedUtil] = await util.getAnchorConfigs(testWallet2);
    testWallet2ProfilePda = seedUtil.profilePda;
    testWallet1 = await primeNewWallet("Test Wallet");
    [provider, program, seedUtil] = await util.getAnchorConfigs(testWallet1);
    testWallet1ProfilePda = seedUtil.profilePda;
  });

  it("create a profile for second wallet", async () => {
    await anchor.web3
      .sendAndConfirmTransaction(
        connection,
        await util.createProfileTransaction(
          testWallet2,
          testHandle2,
          testDisplayName2
        ),
        [testWallet2.payer]
      )
      .catch((err) => {
        console.log(err);
      });
  });

  it("create profile ata for second wallet", async () => {
    await anchor.web3
      .sendAndConfirmTransaction(
        connection,
        await util.createProfileATATransaction(testWallet2),
        [testWallet2.payer]
      )
      .catch((err) => {
        console.log(err);
      });
  });

  it("like a tweet", async () => {
    await anchor.web3
      .sendAndConfirmTransaction(
        connection,
        await util.createLikeTransaction(testWallet2, testWallet1TweetPda),
        [testWallet2.payer]
      )
      .catch((err) => {
        console.log(err);
      });
  });

  it("Try to like the same tweet again", async () => {
    try {
      await anchor.web3.sendAndConfirmTransaction(
        connection,
        await util.createLikeTransaction(testWallet2, testWallet1TweetPda),
        [testWallet2.payer]
      );
      throw "Test failed. User was able to like a tweet again.";
    } catch (_) {}
  });

  it("Retweet a tweet", async () => {
    await anchor.web3
      .sendAndConfirmTransaction(
        connection,
        await util.createRetweetTransaction(testWallet2, testWallet1TweetPda),
        [testWallet2.payer]
      )
      .catch((err) => {
        console.log(err);
      });
  });

  it("Try to retweet the same tweet again", async () => {
    try {
      await anchor.web3.sendAndConfirmTransaction(
        connection,
        await util.createRetweetTransaction(testWallet2, testWallet1TweetPda),
        [testWallet2.payer]
      );
      throw "Test failed. User was able to retweet a tweet again.";
    } catch (_) {}
  });

  async function primeNewWallet(walletName: string) {
    const keypair = anchor.web3.Keypair.generate();
    await connection.confirmTransaction(
      await connection.requestAirdrop(
        keypair.publicKey,
        1 * anchor.web3.LAMPORTS_PER_SOL
      )
    );
    const balance = await connection.getBalance(keypair.publicKey);
    console.log(`${walletName}: ${balance / anchor.web3.LAMPORTS_PER_SOL} SOL`);
    console.log(`Pubkey: ${keypair.publicKey}`);
    return new anchor.Wallet(keypair);
  }

  async function writeTweet(message: string) {
    await anchor.web3
      .sendAndConfirmTransaction(
        connection,
        await util.createTweetTransaction(testWallet1, message),
        [testWallet1.payer]
      )
      .catch((err) => {
        console.log(err);
      });
    testWallet1TweetPda = await seedUtil.getLatestTweetPda();
    await printTweet(testWallet1TweetPda);
  }

  async function printTweet(pubkey: anchor.web3.PublicKey) {
    const tweet = await program.account.solanaTweet.fetch(pubkey);
    const profileInfo = await program.account.solChirpProfile.fetch(
      tweet.profilePubkey
    );
    console.log(`Tweet      : ${pubkey}`);
    console.log(`   Profile     : ${tweet.profilePubkey}`);
    console.log(`   Handle      : ${profileInfo.handle}`);
    console.log(`   Display Name: ${profileInfo.displayName}`);
    console.log(`   Belongs to  : ${profileInfo.authority}`);
    console.log(`   Tweet Count : ${profileInfo.tweetCount}`);
    console.log(`   Tweet Number: ${tweet.tweetNumber}`);
    console.log(`   Body        : ${tweet.body}`);
  }
});

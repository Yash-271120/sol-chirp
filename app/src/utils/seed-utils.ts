import * as anchor from "@coral-xyz/anchor";
import * as constants from "./const";
import { SolChirp } from "../types/sol_chirp";

export class SeedUtil {
  program: anchor.Program<SolChirp>;
  profilePda: anchor.web3.PublicKey;
  likeMintPda: anchor.web3.PublicKey;
  likeMetadataPda: anchor.web3.PublicKey;
  likeMintAuthorityPda: anchor.web3.PublicKey;
  retweetMintPda: anchor.web3.PublicKey;
  retweetMetadataPda: anchor.web3.PublicKey;
  retweetMintAuthorityPda: anchor.web3.PublicKey;

  constructor(
    program: anchor.Program<SolChirp>,
    walletPubKey: anchor.web3.PublicKey
  ) {
    this.program = program;

    this.profilePda = this.derivePda([
      Buffer.from(constants.PROFILE_SEED_PREFIX),
      walletPubKey.toBuffer(),
    ]);

    this.likeMintPda = this.derivePda([
      Buffer.from(constants.LIKE_MINT_SEED_PREFIX),
    ]);

    this.likeMetadataPda = this.deriveMetadataPda([
      Buffer.from("metadata"),
      constants.TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      this.likeMintPda.toBuffer(),
    ]);

    this.likeMintAuthorityPda = this.derivePda([
      Buffer.from(constants.LIKE_MINT_AUTHORITY_SEED_PREFIX),
      this.likeMintPda.toBuffer(),
    ]);

    this.retweetMintPda = this.derivePda([
      Buffer.from(constants.RETWEET_MINT_SEED_PREFIX),
    ]);

    this.retweetMetadataPda = this.deriveMetadataPda([
      Buffer.from("metadata"),
      constants.TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      this.retweetMintPda.toBuffer(),
    ]);

    this.retweetMintAuthorityPda = this.derivePda([
      Buffer.from(constants.RETWEET_MINT_AUTHORITY_SEED_PREFIX),
      this.retweetMintPda.toBuffer(),
    ]);
  }

  derivePda(seeds: Buffer[]) {
    const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      this.program.programId
    );

    return pda;
  }

  deriveMetadataPda(seeds: Buffer[]) {
    const [metadataPda] = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      constants.TOKEN_METADATA_PROGRAM_ID
    );

    return metadataPda;
  }

  async getNextTweetPda(): Promise<anchor.web3.PublicKey> {
    const tweetCount = (
      await this.program.account.solChirpProfile.fetch(this.profilePda)
    ).tweetCount as number;

    console.log("tweetCount is : ", tweetCount);

    return this.derivePda([
      Buffer.from(constants.TWEET_SEED_PREFIX),
      this.profilePda.toBuffer(),
      Buffer.from((tweetCount + 1).toString()),
    ]);
  }

  async getLatestTweetPda(): Promise<anchor.web3.PublicKey> {
    const tweetCount = (
      await this.program.account.solChirpProfile.fetch(this.profilePda)
    ).tweetCount as number;

    return this.derivePda([
      Buffer.from(constants.TWEET_SEED_PREFIX),
      this.profilePda.toBuffer(),
      Buffer.from(tweetCount.toString()),
    ]);
  }

  async getLikePda(
    tweetPda: anchor.web3.PublicKey
  ): Promise<anchor.web3.PublicKey> {
    return this.derivePda([
      Buffer.from(constants.LIKE_SEED_PREFIX),
      this.profilePda.toBuffer(),
      tweetPda.toBuffer(),
    ]);
  }

  async getRetweetPda(
    tweetPda: anchor.web3.PublicKey
  ): Promise<anchor.web3.PublicKey> {
    return this.derivePda([
      Buffer.from(constants.RETWEET_SEED_PREFIX),
      this.profilePda.toBuffer(),
      tweetPda.toBuffer(),
    ]);
  }

  getLikeTokenAccount(
    walletPubKey: anchor.web3.PublicKey
  ): anchor.web3.PublicKey{
    return anchor.utils.token.associatedAddress({
      mint: this.likeMintPda,
      owner: walletPubKey,
    });
  }

  getRetweetTokenAccount(
    walletPubKey: anchor.web3.PublicKey
  ): anchor.web3.PublicKey{
    return anchor.utils.token.associatedAddress({
      mint: this.retweetMintPda,
      owner: walletPubKey,
    });
  }

  async getWalletAndLikeTokenAccountFromTweet(
    tweetPubKey: anchor.web3.PublicKey
  ): Promise<[anchor.web3.PublicKey, anchor.web3.PublicKey]> {
    const authorPubKey = (
      await this.program.account.solanaTweet.fetch(tweetPubKey)
    ).walletPubkey;

    return [authorPubKey, await this.getLikeTokenAccount(authorPubKey)];
  }

  async getWalletAndRetweetTokenAccountFromTweet(
    tweetPubKey: anchor.web3.PublicKey
  ): Promise<[anchor.web3.PublicKey, anchor.web3.PublicKey]> {
    const authorPubKey = (
      await this.program.account.solanaTweet.fetch(tweetPubKey)
    ).walletPubkey;

    return [authorPubKey, await this.getRetweetTokenAccount(authorPubKey)];
  }
}

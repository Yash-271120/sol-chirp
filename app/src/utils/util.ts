import { MPL_TOKEN_METADATA_PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import * as anchor from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import * as constants from "./const";
import {
  allLikesErr,
  allRetweetsErr,
  allTweetsErr,
  profileNotFoundErr,
  tweetNotFoundErr,
  walletNullErr,
} from "./error";
import { SeedUtil } from "./seed-utils";
import IDL from "./idl/sol_chirp.json";
import { SolChirp } from "../types/sol_chirp";
import { ProfileObject, TweetObject } from "../types/types";

export async function getAnchorConfigs(
  wallet: AnchorWallet
): Promise<[anchor.AnchorProvider, anchor.Program<SolChirp>, SeedUtil]> {
  if (!wallet) return walletNullErr();
  const provider = new anchor.AnchorProvider(
    new anchor.web3.Connection(
      constants.NETWORK as string,
      constants.PREFLIGHT_COMMITMENT
    ),
    wallet,
    { preflightCommitment: constants.PREFLIGHT_COMMITMENT }
  );

  const program = new anchor.Program(IDL as SolChirp, provider);

  const seetUtil = new SeedUtil(program, wallet.publicKey);

  return [provider, program, seetUtil];
}

export async function createMintsTransaction(
  wallet: AnchorWallet
): Promise<anchor.web3.Transaction> {
  const [provider, program, seedUtil] = await getAnchorConfigs(wallet);

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

  return new anchor.web3.Transaction().add(likeMintIx).add(retweetMintIx);
}

export async function createProfileTransaction(
  wallet: AnchorWallet,
  handle: string,
  displayName: string
): Promise<anchor.web3.Transaction> {
  const [provider, program, seedUtil] = await getAnchorConfigs(wallet);

  const profileIx = await program.methods
    .createProfile(handle, displayName)
    .accounts({
      authority: provider.wallet.publicKey,
    })
    .instruction();

  return new anchor.web3.Transaction().add(profileIx);
}

export async function createProfileATATransaction(
  wallet: AnchorWallet
): Promise<anchor.web3.Transaction> {
  const [provider, program, seedUtil] = await getAnchorConfigs(wallet);
  console.log("inside ata: ", provider.wallet.publicKey.toString());
  const profileATAIx = await program.methods
    .createProfileAtas()
    .accounts({
      authority: provider.wallet.publicKey,
      likeTokenAccount: seedUtil.getLikeTokenAccount(wallet.publicKey),
      retweetTokenAccount: seedUtil.getRetweetTokenAccount(wallet.publicKey),
    })
    .instruction();

  return new anchor.web3.Transaction().add(profileATAIx);
}

export async function getProfile(wallet: AnchorWallet): Promise<ProfileObject> {
  const [provider, program, seedUtil] = await getAnchorConfigs(wallet);
  const profilePubKey = seedUtil.profilePda;
  let profile: anchor.IdlTypes<SolChirp>["solChirpProfile"];

  try {
    profile = await program.account.solChirpProfile.fetch(profilePubKey);
  } catch (_) {
    profileNotFoundErr(profilePubKey);
  }
  return {
    walletPubkey: profile.authority,
    profilePubkey: profilePubKey,
    displayName: profile.displayName,
    handle: profile.handle,
    tweetCount: profile.tweetCount,
  };
}

export async function createTweetTransaction(
  wallet: AnchorWallet,
  message: string
): Promise<anchor.web3.Transaction> {
  const [provider, program, seedUtil] = await getAnchorConfigs(wallet);

  const tweetIx = await program.methods
    .createTweet(message)
    .accounts({
      tweet: await seedUtil.getNextTweetPda(),
      profile: seedUtil.profilePda,
      authority: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .instruction();

  return new anchor.web3.Transaction().add(tweetIx);
}

export async function getTweet(
  wallet: AnchorWallet,
  tweetPubkey: anchor.web3.PublicKey
): Promise<TweetObject> {
  const [provider, program, seedUtil] = await getAnchorConfigs(wallet);
  let tweet: anchor.IdlTypes<SolChirp>["solanaTweet"];
  try {
    tweet = await program.account.solanaTweet.fetch(tweetPubkey);
  } catch (_) {
    tweetNotFoundErr(tweetPubkey);
  }
  const profilePubKey = tweet.profilePubkey;
  let profile: anchor.IdlTypes<SolChirp>["solChirpProfile"];
  try {
    profile = await program.account.solChirpProfile.fetch(profilePubKey);
  } catch (_) {
    profileNotFoundErr(profilePubKey);
  }

  const tweetLiked = (await getLike(wallet, tweetPubkey)) ? true : false;
  const tweetRetweeted = (await getRetweet(wallet, tweetPubkey)) ? true : false;

  return {
    walletPubkey: profile.authority,
    profilePubkey: profilePubKey,
    tweetPubkey: tweetPubkey,
    displayName: profile.displayName,
    handle: profile.handle,
    message: tweet.body,
    likeCount: tweet.likeCount,
    retweetCount: tweet.retweetCount,
    tweetLiked: tweetLiked,
    tweetRetweeted: tweetRetweeted,
  };
}

export async function getAllTweets(
  wallet: AnchorWallet
): Promise<TweetObject[]> {
  const [provider, program, seedUtil] = await getAnchorConfigs(wallet);
  let allTweets: TweetObject[] = [];
  let allTweetsResponse: anchor.IdlAccounts<SolChirp>["solanaTweet"][];
  let allTweetsAccounts: anchor.ProgramAccount<{
    walletPubkey: anchor.web3.PublicKey;
    profilePubkey: anchor.web3.PublicKey;
    tweetNumber: number;
    likeCount: number;
    retweetCount: number;
    body: string;
    bump: number;
  }>[];
  try {
    allTweetsAccounts = await program.account.solanaTweet.all();
  } catch (_) {
    allTweetsErr();
  }

  for (let tweet of allTweetsAccounts) {
    const profilePubKey: anchor.web3.PublicKey = tweet.account.profilePubkey;
    const tweetPubKey: anchor.web3.PublicKey = tweet.publicKey;
    let profile: anchor.IdlTypes<SolChirp>["solChirpProfile"];
    try {
      profile = await program.account.solChirpProfile.fetch(profilePubKey);
    } catch (_) {
      profileNotFoundErr(profilePubKey);
    }

    let tweetLiked = false;
    try {
      await getLike(wallet, tweetPubKey)
      tweetLiked = true;
    } catch {}
    
    let tweetRetweeted = false;
    try {
      await getRetweet(wallet, tweetPubKey)
      tweetRetweeted = true;
    } catch {}

    allTweets.push({
      walletPubkey: profile.authority,
      profilePubkey: profilePubKey,
      tweetPubkey: tweetPubKey,
      displayName: profile.displayName,
      handle: profile.handle,
      message: tweet.account.body,
      likeCount: tweet.account.likeCount,
      retweetCount: tweet.account.retweetCount,
      tweetLiked: tweetLiked,
      tweetRetweeted: tweetRetweeted,
    });
  }

  return allTweets;
}

export async function createLikeTransaction(
  wallet: AnchorWallet,
  tweetPubKey: anchor.web3.PublicKey
): Promise<anchor.web3.Transaction> {
  const [provider, program, seedUtil] = await getAnchorConfigs(wallet);
  const [authorWalletPubkey, authorLikeTokenAccount] =
    await seedUtil.getWalletAndLikeTokenAccountFromTweet(tweetPubKey);

  const likeIx = await program.methods
    .createLike()
    .accountsPartial({
      likeMint: seedUtil.likeMintPda,
      likeAuthority: seedUtil.likeMintAuthorityPda,
      authorTokenAccount: authorLikeTokenAccount,
      like: await seedUtil.getLikePda(tweetPubKey),
      tweet: tweetPubKey,
      submitterProfile: seedUtil.profilePda,
      authorWallet: authorWalletPubkey,
      authority: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
    })
    .instruction();

  return new anchor.web3.Transaction().add(likeIx);
}

export async function getLike(
  wallet: AnchorWallet,
  tweetPubkey: anchor.web3.PublicKey
): Promise<ProfileObject> {
  const [provider, program, seedUtil] = await getAnchorConfigs(wallet);
  const likePubkey = await seedUtil.getLikePda(tweetPubkey);
  let like: anchor.IdlTypes<SolChirp>["solanaLike"];
  try {
    like = await program.account.solanaLike.fetch(likePubkey);
  } catch (_) {
    tweetNotFoundErr(tweetPubkey);
  }

  const profilePubKey: anchor.web3.PublicKey = like.profilePubkey;

  let profile: anchor.IdlTypes<SolChirp>["solChirpProfile"];
  try {
    profile = await program.account.solChirpProfile.fetch(profilePubKey);
  } catch (_) {
    profileNotFoundErr(profilePubKey);
  }

  return {
    walletPubkey: profile.authority,
    profilePubkey: profilePubKey,
    displayName: profile.displayName,
    handle: profile.handle,
    tweetCount: profile.tweetCount,
  };
}

export async function getAllLikesForTweet(
  wallet: AnchorWallet,
  tweetPubKey: anchor.web3.PublicKey
): Promise<ProfileObject[]> {
  const [provider, program, seedUtil] = await getAnchorConfigs(wallet);
  let allLikes: ProfileObject[] = [];
  let allLikesResponse: anchor.IdlAccounts<SolChirp>["solanaLike"][];
  let allLikesAccounts: anchor.ProgramAccount<{
    walletPubkey: anchor.web3.PublicKey;
    profilePubkey: anchor.web3.PublicKey;
    tweetPubkey: anchor.web3.PublicKey;
    authority: anchor.web3.PublicKey;
    bump: number;
  }>[];
  try {
    allLikesAccounts = await program.account.solanaLike.all();
  } catch (_) {
    allLikesErr(tweetPubKey);
  }

  for (let like of allLikesAccounts) {
    if (like.account.tweetPubkey.equals(tweetPubKey)) {
      const profilePubKey: anchor.web3.PublicKey = like.account.profilePubkey;
      let profile: anchor.IdlTypes<SolChirp>["solChirpProfile"];
      try {
        profile = await program.account.solChirpProfile.fetch(profilePubKey);
      } catch (_) {
        profileNotFoundErr(profilePubKey);
      }

      allLikes.push({
        walletPubkey: like.account.walletPubkey,
        profilePubkey: like.account.profilePubkey,
        displayName: profile.displayName,
        handle: profile.handle,
        tweetCount: profile.tweetCount,
      });
    }
  }

  return allLikes;
}

export async function createRetweetTransaction(
  wallet: AnchorWallet,
  tweetPubKey: anchor.web3.PublicKey
): Promise<anchor.web3.Transaction> {
  const [provider, program, seedUtil] = await getAnchorConfigs(wallet);
  const [authorWalletPubkey, authorRetweetTokenAccount] =
    await seedUtil.getWalletAndRetweetTokenAccountFromTweet(tweetPubKey);

  const retweetIx = await program.methods
    .createRetweet()
    .accountsPartial({
      authorTokenAccount: authorRetweetTokenAccount,
      authorWallet: authorWalletPubkey,
      tweet: tweetPubKey,
      submitterProfile: seedUtil.profilePda,
      authority: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      retweet:await seedUtil.getRetweetPda(tweetPubKey),
      retweetAuthority: seedUtil.retweetMintAuthorityPda,
      retweetMint: seedUtil.retweetMintPda,
    })
    .instruction();
  return new anchor.web3.Transaction().add(retweetIx);
}

export async function getRetweet(
  wallet: AnchorWallet,
  tweetPubkey: anchor.web3.PublicKey
): Promise<ProfileObject> {
  const [provider, program, seedUtil] = await getAnchorConfigs(wallet);
  const retweetPubkey = await seedUtil.getRetweetPda(tweetPubkey);
  let retweet: anchor.IdlTypes<SolChirp>["solanaRetweet"];
  try {
    retweet = await program.account.solanaRetweet.fetch(retweetPubkey);
  } catch (_) {
    tweetNotFoundErr(tweetPubkey);
  }

  const profilePubKey: anchor.web3.PublicKey = retweet.profilePubkey;

  let profile: anchor.IdlTypes<SolChirp>["solChirpProfile"];
  try {
    profile = await program.account.solChirpProfile.fetch(profilePubKey);
  } catch (_) {
    profileNotFoundErr(profilePubKey);
  }

  return {
    walletPubkey: profile.authority,
    profilePubkey: profilePubKey,
    displayName: profile.displayName,
    handle: profile.handle,
    tweetCount: profile.tweetCount,
  };
}

export async function getAllRetweetsForTweet(
  wallet: AnchorWallet,
  tweetPubKey: anchor.web3.PublicKey
): Promise<ProfileObject[]> {
  const [provider, program, seedUtil] = await getAnchorConfigs(wallet);
  let allRetweets: ProfileObject[] = [];
  let allRetweetsResponse: anchor.IdlAccounts<SolChirp>["solanaRetweet"][];
  let allRetweetsAccounts: anchor.ProgramAccount<{
    walletPubkey: anchor.web3.PublicKey;
    profilePubkey: anchor.web3.PublicKey;
    tweetPubkey: anchor.web3.PublicKey;
    authority: anchor.web3.PublicKey;
    bump: number;
  }>[];
  try {
    allRetweetsAccounts = await program.account.solanaRetweet.all();
  } catch (_) {
    allRetweetsErr(tweetPubKey);
  }

  for (let retweet of allRetweetsAccounts) {
    if (retweet.account.tweetPubkey.equals(tweetPubKey)) {
      const profilePubKey: anchor.web3.PublicKey =
        retweet.account.profilePubkey;
      let profile: anchor.IdlTypes<SolChirp>["solChirpProfile"];
      try {
        profile = await program.account.solChirpProfile.fetch(profilePubKey);
      } catch (_) {
        profileNotFoundErr(profilePubKey);
      }

      allRetweets.push({
        walletPubkey: retweet.account.walletPubkey,
        profilePubkey: retweet.account.profilePubkey,
        displayName: profile.displayName,
        handle: profile.handle,
        tweetCount: profile.tweetCount,
      });
    }
  }

  return allRetweets;
}

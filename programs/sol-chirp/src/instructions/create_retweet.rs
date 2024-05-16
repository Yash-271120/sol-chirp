use anchor_lang::{prelude::*, solana_program::entrypoint::ProgramResult};
use anchor_spl::token::{mint_to, Mint, MintTo, Token, TokenAccount};

use crate::state::RetweetMintAuthorityPda;
use crate::state::SolChirpProfile;
use crate::state::SolanaRetweet;
use crate::state::SolanaTweet;

pub fn create_retweet(ctx: Context<CreateRetweet>) -> ProgramResult {
    let tweet = &mut ctx.accounts.tweet;

    let retweet = SolanaRetweet::new(
        ctx.accounts.authority.key(),
        ctx.accounts.submitter_profile.key(),
        tweet.key(),
        ctx.accounts.authority.key(),
        ctx.bumps.retweet,
    );

    tweet.retweet_count = tweet.retweet_count.checked_add(1).unwrap();
    ctx.accounts.retweet.set_inner(retweet);

    mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.retweet_mint.to_account_info(),
                to: ctx.accounts.author_token_account.to_account_info(),
                authority: ctx.accounts.retweet_authority.to_account_info(),
            },
            &[&[
                RetweetMintAuthorityPda::SEED_PREFIX.as_bytes().as_ref(),
                ctx.accounts.retweet_mint.key().as_ref(),
                &[ctx.accounts.retweet_authority.bump],
            ]],
        ),
        1,
    )?;

    Ok(())
}

#[derive(Accounts)]
pub struct CreateRetweet<'info> {
    //mint account
    #[account(
        mut,
        seeds = [
            RetweetMintAuthorityPda::MINT_SEED_PREFIX.as_bytes().as_ref(),
        ],
        bump = retweet_authority.mint_bump,
    )]
    pub retweet_mint: Account<'info, Mint>,

    //mint authority
    #[account(
        mut,
        seeds = [
            RetweetMintAuthorityPda::SEED_PREFIX.as_bytes().as_ref(),
            retweet_mint.key().as_ref(),
        ],
        bump = retweet_authority.bump,
    )]
    pub retweet_authority: Account<'info, RetweetMintAuthorityPda>,

    //auther token account
    #[account(
        mut,
        associated_token::mint = retweet_mint,
        associated_token::authority = author_wallet,
    )]
    pub author_token_account: Account<'info, TokenAccount>,

    //tweet account
    #[account(
        mut,
        seeds = [
            SolanaTweet::SEED_PREFIX.as_bytes().as_ref(),
            tweet.profile_pubkey.as_ref(),
            tweet.tweet_number.to_string().as_bytes().as_ref(),
        ],
        bump = tweet.bump,
    )]
    pub tweet: Account<'info, SolanaTweet>,

    // retweet account
    #[account(
        init,
        payer = authority,
        space = 8 + SolanaRetweet::INIT_SPACE,
        seeds = [
            SolanaRetweet::SEED_PREFIX.as_bytes().as_ref(),
            submitter_profile.key().as_ref(),
            tweet.key().as_ref(),
        ],
        bump,
    )]
    pub retweet: Account<'info, SolanaRetweet>,
    // submitter_account
    #[account(
        mut,
        has_one=authority,
        seeds = [
            SolChirpProfile::SEED_PREFIX.as_bytes().as_ref(),
            authority.key().as_ref(),
        ],
        bump = submitter_profile.bump,
    )]
    pub submitter_profile: Account<'info, SolChirpProfile>,

    // authority
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,

    ///CHECK: This is for airdrops
    pub author_wallet: AccountInfo<'info>,
}

use anchor_lang::{prelude::*,solana_program::entrypoint::ProgramResult};
use anchor_spl::token::{Token,Mint,TokenAccount,mint_to,MintTo};

use crate::state::SolanaLike;
use crate::state::SolChirpProfile;
use crate::state::LikeMintAuthorityPda;
use crate::state::SolanaTweet;


pub fn create_like(
    ctx: Context<CreateLike>,
) -> ProgramResult {
    let tweet = &mut ctx.accounts.tweet;
    let like = SolanaLike::new(
        ctx.accounts.authority.key(),
        ctx.accounts.submitter_profile.key(),
        tweet.key(),
        ctx.accounts.authority.key(),
        ctx.bumps.like,
    );

    ctx.accounts.like.set_inner(like);
    tweet.like_count = tweet.like_count.checked_add(1).unwrap();

    mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(), 
            MintTo{
                mint: ctx.accounts.like_mint.to_account_info(),
                to: ctx.accounts.author_token_account.to_account_info(),
                authority: ctx.accounts.like_authority.to_account_info(),
            }, 
            &[&[
                    LikeMintAuthorityPda::SEED_PREFIX.as_bytes().as_ref(),
                    ctx.accounts.like_mint.key().as_ref(),
                    &[ctx.accounts.like_authority.bump],
                ]]
        ), 
        1)?;

    msg!("Liked the tweet");
    Ok(())
}

#[derive(Accounts)]
pub struct CreateLike<'info> {
    //mint account
    #[account(
        mut,
        seeds = [
            LikeMintAuthorityPda::MINT_SEED_PREFIX.as_bytes().as_ref(),
        ], 
        bump = like_authority.mint_bump,
    )]
    pub like_mint: Account<'info, Mint>,

    //mint authority
    #[account(
        mut,
        seeds = [
            LikeMintAuthorityPda::SEED_PREFIX.as_bytes().as_ref(),
            like_mint.key().as_ref(),
        ],
        bump = like_authority.bump,
    )]
    pub like_authority: Account<'info, LikeMintAuthorityPda>,

    //like associated token account
    #[account(
        mut,
        associated_token::mint = like_mint,
        associated_token::authority = author_wallet,
    )]
    pub author_token_account: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = authority,
        space = 8+SolanaLike::INIT_SPACE,
        seeds = [
            SolanaLike::SEED_PREFIX.as_bytes().as_ref(),
            submitter_profile.key().as_ref(),
            tweet.key().as_ref(),
        ],
        bump
    )]
    pub like: Account<'info,SolanaLike>,


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

    #[account(
        mut,
        has_one = authority,
        seeds = [
            SolChirpProfile::SEED_PREFIX.as_bytes().as_ref(),
            authority.key().as_ref(),
        ],
        bump = submitter_profile.bump,
    )]
    pub submitter_profile: Account<'info, SolChirpProfile>,
    #[account(mut)]
    pub authority: Signer<'info>,
    ///CHECK: This is for airdrops
    pub author_wallet: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}
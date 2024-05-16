use anchor_lang::{prelude::*, solana_program::entrypoint::ProgramResult};
use anchor_spl::{token::{TokenAccount,Mint,Token},associated_token::AssociatedToken};

use crate::state::LikeMintAuthorityPda;
use crate::state::RetweetMintAuthorityPda;

pub fn create_profile_atas(
    _ctx: Context<CreateProfileAtas>,
) -> ProgramResult {    
    Ok(())
}


#[derive(Accounts)]
pub struct CreateProfileAtas<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,

    // Likes
    // like mint
    #[account(
        mut,
        seeds = [
            LikeMintAuthorityPda::MINT_SEED_PREFIX.as_bytes().as_ref(),
        ],
        bump = like_authority.mint_bump,
        mint::decimals = 9,
        mint::authority = like_authority.key(),
    )]
    pub like_mint: Account<'info,Mint>,

    // link mint authority pda
    #[account(
        mut,
        seeds = [
            LikeMintAuthorityPda::SEED_PREFIX.as_bytes().as_ref(),
            like_mint.key().as_ref(),
        ],
        bump = like_authority.bump,
    )]
    pub like_authority: Account<'info, LikeMintAuthorityPda>,

    // like token account
    #[account(
        init,
        payer = authority,
        associated_token::mint = like_mint,
        associated_token::authority = authority,
    )]
    pub like_token_account:Account<'info,TokenAccount>,

    // Retweets
    // retweet mint
    #[account(
        mut,
        seeds = [
            RetweetMintAuthorityPda::MINT_SEED_PREFIX.as_bytes().as_ref(),
        ],
        bump = retweet_authority.mint_bump,
        mint::decimals = 9,
        mint::authority = retweet_authority.key(),
    )]
    pub retweet_mint: Account<'info,Mint>,

    // link mint authority pda
    #[account(
        mut,
        seeds = [
            RetweetMintAuthorityPda::SEED_PREFIX.as_bytes().as_ref(),
            retweet_mint.key().as_ref(),
        ],
        bump = retweet_authority.bump,
    )]
    pub retweet_authority: Account<'info, RetweetMintAuthorityPda>,

    // retweet token account
    #[account(
        init,
        payer = authority,
        associated_token::mint = retweet_mint,
        associated_token::authority = authority,
    )]
    pub retweet_token_account:Account<'info,TokenAccount>,
}
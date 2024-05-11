use anchor_lang::{prelude::*, solana_program::entrypoint::ProgramResult};
use anchor_spl::{token::{TokenAccount,Mint,Token},associated_token::AssociatedToken};

use crate::state::SolChirpProfile;
use crate::state::RetweetMintAuthorityPda;
use crate::state::LikeMintAuthorityPda;


pub fn create_profile(
    ctx: Context<CreateProfile>,
    handle: String,
    display_name: String,
) -> ProgramResult {
    let profile = SolChirpProfile::new(
        handle, 
        display_name, 
        ctx.accounts.authority.key(), 
        ctx.bumps.profile,
    );

    ctx.accounts.profile.set_inner(profile);
    
    Ok(())
}

 #[derive(Accounts)]
#[instruction(handle: String, display_name: String)]
pub struct CreateProfile<'info> {
    #[account(
        init, 
        payer = authority, 
        space = SolChirpProfile::get_space(handle, display_name), 
        seeds = [SolChirpProfile::SEED_PREFIX.as_bytes().as_ref(), authority.key().as_ref()], 
        bump
    )]
    pub profile: Account<'info, SolChirpProfile>,
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

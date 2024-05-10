use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use anchor_spl::{
    metadata::{create_metadata_accounts_v3, CreateMetadataAccountsV3, Metadata},
    token::{self, Token},
};
use mpl_token_metadata::types::DataV2;

use crate::state::LikeMintAuthorityPda;
use crate::state::LikeMintMetadata;
use crate::state::RetweetMintAuthorityPda;
use crate::state::RetweetMintMetadata;

pub fn create_like_mint(ctx: Context<CreateLikeMint>) -> ProgramResult {
    let token_data: DataV2 = DataV2 {
        collection: None,
        creators: None,
        name: LikeMintMetadata::TITLE.to_string(),
        symbol: LikeMintMetadata::SYMBOL.to_string(),
        uri: LikeMintMetadata::URI.to_string(),
        seller_fee_basis_points: 0,
        uses: None,
    };

    create_metadata_accounts_v3(
        CpiContext::new_with_signer(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMetadataAccountsV3 {
                payer: ctx.accounts.payer.to_account_info(),
                update_authority: ctx.accounts.like_authority.to_account_info(),
                metadata: ctx.accounts.like_metadata.to_account_info(),
                mint: ctx.accounts.like_mint.to_account_info(),
                mint_authority: ctx.accounts.like_authority.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
            &[&[
                LikeMintAuthorityPda::SEED_PREFIX.as_bytes().as_ref(),
                ctx.accounts.like_mint.key().as_ref(),
                &[ctx.bumps.like_authority],
            ]],
        ),
        token_data,
        false,
        true,
        None,
    )?;

    msg!("Like mint created successfully");

    return Ok(());
}

#[derive(Accounts)]
pub struct CreateLikeMint<'info> {
    #[account(mut)]
    pub like_metadata: UncheckedAccount<'info>,

    //init mint
    #[account(
        init,
        payer = payer,
        seeds = [
            LikeMintAuthorityPda::MINT_SEED_PREFIX.as_bytes().as_ref(),
        ],
        bump,
        mint::decimals = 9,
        mint::authority = like_authority.key(),
    )]
    pub like_mint: Account<'info, token::Mint>,

    // init authority
    #[account(
        init,
        payer = payer,
        space = LikeMintAuthorityPda::INIT_SPACE,
        seeds = [
            LikeMintAuthorityPda::SEED_PREFIX.as_bytes().as_ref(),
            like_mint.key().as_ref(),
        ],
        bump,
    )]
    pub like_authority: Account<'info, LikeMintAuthorityPda>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    pub token_metadata_program: Program<'info, Metadata>,
}

pub fn create_retweet_mint(ctx: Context<CreateRetweetMint>) -> ProgramResult {
    let token_data: DataV2 = DataV2 {
        collection: None,
        creators: None,
        uses: None,
        name: RetweetMintMetadata::TITLE.to_string(),
        seller_fee_basis_points: 0,
        symbol: RetweetMintMetadata::SYMBOL.to_string(),
        uri: RetweetMintMetadata::URI.to_string(),
    };

    create_metadata_accounts_v3(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            CreateMetadataAccountsV3 {
                metadata: ctx.accounts.retweet_metadata.to_account_info(),
                mint: ctx.accounts.retweet_mint.to_account_info(),
                mint_authority: ctx.accounts.retweet_authority.to_account_info(),
                payer: ctx.accounts.payer.to_account_info(),
                update_authority: ctx.accounts.retweet_authority.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
            &[&[
                RetweetMintAuthorityPda::SEED_PREFIX.as_bytes().as_ref(),
                ctx.accounts.retweet_mint.key().as_ref(),
                &[ctx.bumps.retweet_authority],
            ]],
        ),
        token_data,
        false,
        true,
        None,
    )?;

    msg!("Retweet mint created successfully");
    Ok(())
}

#[derive(Accounts)]
pub struct CreateRetweetMint<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,

    pub retweet_metadata: UncheckedAccount<'info>,

    // init mint
    #[account(
        init,
        payer=payer,
        seeds=[
            RetweetMintAuthorityPda::MINT_SEED_PREFIX.as_bytes().as_ref()
        ],
        bump,
        mint::decimals = 9,
        mint::authority = retweet_authority.key()
    )]
    pub retweet_mint: Account<'info, token::Mint>,

    //init mint authority
    #[account(
        init,
        payer = payer,
        space=RetweetMintAuthorityPda::INIT_SPACE,
        seeds=[
            RetweetMintAuthorityPda::SEED_PREFIX.as_bytes().as_ref(),
            retweet_mint.key().as_ref()
        ],
        bump
    )]
    pub retweet_authority: Account<'info, RetweetMintAuthorityPda>,
}

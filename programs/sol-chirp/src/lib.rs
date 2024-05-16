use anchor_lang::{prelude::*, solana_program::entrypoint::ProgramResult};

use instructions::*;

pub mod instructions;
pub mod state;

declare_id!("H26sRLnKwFvYM4pAe8mhLtnHaAqndNQpGEmpbrmmVhj8");

#[program]
pub mod sol_chirp {
    use super::*;

    pub fn create_profile_atas(ctx: Context<CreateProfileAtas>) -> ProgramResult {
        instructions::create_profile_atas::create_profile_atas(ctx)
    }

    pub fn create_profile(
        ctx: Context<CreateProfile>,
        handle: String,
        display_name: String,
    ) -> ProgramResult {
        instructions::create_profile::create_profile(ctx, handle, display_name)
    }

    pub fn create_like_mint(ctx: Context<CreateLikeMint>) -> ProgramResult {
        instructions::create_mint::create_like_mint(ctx)
    }

    pub fn create_retweet_mint(ctx: Context<CreateRetweetMint>) -> ProgramResult {
        instructions::create_mint::create_retweet_mint(ctx)
    }

    pub fn create_tweet(ctx: Context<CreateTweet>, body: String) -> ProgramResult {
        instructions::create_tweet::create_tweet(ctx, body)
    }

    pub fn create_like(ctx: Context<CreateLike>) -> ProgramResult {
        instructions::create_like::create_like(ctx)
    }

    pub fn create_retweet(ctx: Context<CreateRetweet>) -> ProgramResult {
        instructions::create_retweet::create_retweet(ctx)
    }
}

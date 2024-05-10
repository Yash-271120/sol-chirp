use anchor_lang::{prelude::*, solana_program::entrypoint::ProgramResult};

use instructions::*;

pub mod instructions;
pub mod state;

declare_id!("5C7KLLMjVxQwsdJrSaXkPw67teuHZeDahgDKTKz55Fza");

#[program]
pub mod sol_chirp {
    use super::*;

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
}

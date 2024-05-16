use anchor_lang::{prelude::*, solana_program::entrypoint::ProgramResult};

use crate::state::SolChirpProfile;


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
        space = SolChirpProfile::get_space(handle,display_name), 
        seeds = [SolChirpProfile::SEED_PREFIX.as_bytes().as_ref(), authority.key().as_ref()], 
        bump
    )]
    pub profile: Account<'info, SolChirpProfile>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

use std::ops::Add;

use anchor_lang::{prelude::*,solana_program::entrypoint::ProgramResult};

use crate::state::SolanaTweet;
use crate::state::SolChirpProfile;


pub fn create_tweet(
    ctx: Context<CreateTweet>,
    body: String,
) -> ProgramResult {
    let profile = &mut ctx.accounts.profile;
    let tweet = SolanaTweet::new(
        ctx.accounts.authority.key(),
        profile.key(),
        profile.tweet_count+1,
        body,
        ctx.bumps.tweet,
    );
    ctx.accounts.tweet.set_inner(tweet);
    profile.tweet_count = profile.tweet_count.checked_add(1).unwrap();
    Ok(())
}


#[derive(Accounts)]
pub struct CreateTweet<'info> {
    #[account(
        init,
        payer = authority,
        space = 8+SolanaTweet::INIT_SPACE,
        seeds = [
            SolanaTweet::SEED_PREFIX.as_bytes().as_ref(),
            profile.key().as_ref(),
            profile.tweet_count.add(1).to_string().as_ref(),
        ],
        bump
    )]
    pub tweet: Account<'info, SolanaTweet>,
    ///Check
    #[account(
        mut,
        has_one = authority,
        seeds = [
            SolChirpProfile::SEED_PREFIX.as_bytes().as_ref(),
            authority.key().as_ref(),
        ],
        bump = profile.bump,
    )]
    pub profile: Account<'info, SolChirpProfile>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

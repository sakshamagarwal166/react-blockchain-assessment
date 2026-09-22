# AI Development Prompts

## 1. Requirements and Architecture

I need to implement the coding assessment I shared. Before we start writing any code, I want to think through the architecture properly.

The requirements are:
- React application
- Redux is required
- A Context Provider for Sepolia that gets the latest block number every 60 seconds and makes it available to the UI
- A custom hook for Ethereum Mainnet that gets the latest block number every 30 seconds and exposes it to the UI
- The assessment specifically mentions that architecture, functionality and code organization are important

Before implementing anything, can you analyze the requirements and suggest how you would structure the application?

I want to understand the proposed folder structure, what responsibility each part should have, where the API calls should be handled, and how Context, Redux and the custom hook should each be used.

Also think about how the polling should work and be cleaned up properly, how loading and API errors should be handled, and any edge cases we should consider.

Please explain the reasoning behind the architecture first. Don't write any implementation code yet.

## 2. Architecture Review

Before we start implementing, let's settle the architecture. One thing I want to be careful about is using Redux, Context, and the custom hook without unnecessarily duplicating state. How would you separate their responsibilities here? Also suggest the folder structure you'd use. Keep it simple and avoid over-engineering.

## 3. Redux Responsibility

I agree Redux should have a real purpose, but I don't want to add controls or change the required polling intervals just to use Redux. Can we keep the UI focused on the assessment and use Redux in a minimal way? Maybe consider whether Redux should own the block data while Context and the custom hook handle the different access/fetching patterns. What would you recommend?

## 4. Implementation

Yes, let's build it this way. Start by scaffolding the Vite + React + TypeScript project and set up Redux Toolkit. Then create the basic folder structure, store, API service, Sepolia context and mainnet hook. Keep the implementation simple and don't add any features beyond the assessment. Once the basic structure is in place, show me what you've created before we move on to the UI.

## 5. Core Code Review

Before we move to the UI, can you review the core implementation you've just created? Check the API response handling, first fetch + polling intervals, cleanup on unmount, React Strict Mode behavior, Redux typing, and error/loading handling. Also check whether there is any unnecessary complexity or anything that doesn't fully match the assessment. Please fix any issues you find and briefly explain the changes.

## 6. UI Implementation

Let's build the UI now. Keep it simple and focused on the assessment. Create separate components for Sepolia and Mainnet, consume Sepolia through the context and Mainnet through the custom hook, and display the current block number with loading and error states. Remove the default Vite UI.

## 7. Final Review

Before we clean anything up or commit, can you do one final review of the current implementation? Check the architecture, Redux/Context/hook responsibilities, polling and cleanup, error/loading handling, and the Vite proxy setup. Also make sure the implementation still matches the assessment exactly and that we haven't added anything unnecessary. Fix any issues you find and then run the build again.

## 8. Final Cleanup

Great. Let's do the final cleanup now. Remove only the unused Vite starter files/assets, make sure the package name and README are appropriate for the assessment, and document the dev proxy/setup briefly. Don't change any application logic. Run the type check and build after the cleanup.
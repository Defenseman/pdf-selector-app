import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Fragment = {
    id: string;
    base64: string;
};

type FragmentsState = {
    fragments: Fragment[];
};

const initialState: FragmentsState = {
    fragments: [],
};

const fragmentSlice = createSlice({
    name: 'fragments',
    initialState,
    reducers: {
        addFragment: (state, action: PayloadAction<Fragment>) => {
            state.fragments.push(action.payload);
        },
        removeFragment: (state, action: PayloadAction<string>) => {
            state.fragments = state.fragments.filter((frag) => frag.id !== action.payload);
        } 
    }
})

export const { addFragment, removeFragment } = fragmentSlice.actions;
export default fragmentSlice.reducer;
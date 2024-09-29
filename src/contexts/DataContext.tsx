import React from 'react';

export const DataContext = React.createContext<{
    data: object;
    setData: React.Dispatch<React.SetStateAction<object>>;
}>({
    data: {},
    setData: () => {}
});
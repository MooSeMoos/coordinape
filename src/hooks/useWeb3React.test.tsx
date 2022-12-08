import { useEffect, useState } from 'react';

import { render, screen, waitFor } from '@testing-library/react';

import { chainId as expectedChainId, provider } from 'utils/testing/provider';

import { useWeb3React } from './useWeb3React';

let address: string;

beforeAll(async () => {
  address = (await provider().send('eth_accounts', []))[0].toLowerCase();
});

test('sets & unsets hook values in response to setProvider', async () => {
  expect.assertions(7);

  const Harness = () => {
    const { setProvider, active, chainId, account, library, deactivate } =
      useWeb3React();
    const [step, setStep] = useState(1);

    useEffect(() => {
      if (step === 1) {
        if (!active) {
          setProvider(provider());
          return;
        }
        expect(library).toEqual(provider());
        expect(chainId).toEqual(expectedChainId);
        expect(account?.toLowerCase()).toEqual(address);
        deactivate();
        setStep(2);
      } else if (step === 2) {
        expect(active).toBeFalsy();
        expect(library).toBeUndefined();
        expect(chainId).toBeUndefined();
        expect(account).toBeUndefined();
      }
    }, [active, step]);

    return <>{step}</>;
  };

  await render(<Harness />);

  await waitFor(() => screen.getByText('2'));
});

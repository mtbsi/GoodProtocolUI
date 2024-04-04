import React, { memo } from 'react'
import { SupportedChains } from '@gooddollar/web3sdk-v2'
import { useFeatureFlagWithPayload } from 'posthog-react-native'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { HStack, Link, Text, VStack } from 'native-base'

import { useNetworkModalToggle } from 'state/application/hooks'
import { UniSwap } from './SwapCelo/UniSwap'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import SwapCore from './SwapCore'
import { PageLayout } from 'components/Layout/PageLayout'

const Swap = memo(() => {
    const { chainId } = useActiveWeb3React()
    const [, payload] = useFeatureFlagWithPayload('swap-feature')
    const { fuseEnabled, celoEnabled, reserveEnabled } = (payload as any) || {}
    const toggleNetworkModal = useNetworkModalToggle()

    const swapComponentMapping = {
        [SupportedChains.FUSE]: { component: <SwapCore />, enabled: fuseEnabled },
        [SupportedChains.MAINNET]: { component: <SwapCore />, enabled: reserveEnabled },
        [SupportedChains.CELO]: { component: <UniSwap />, enabled: celoEnabled },
    }

    const chainConfig = swapComponentMapping[chainId as any]

    if (!chainConfig) {
        return <></>
    }

    return (
        <PageLayout title="Swap" faqType="swap">
            {(chainId as Number) === SupportedChains.MAINNET ? (
                <VStack space={2} textAlign="center" justifyContent="center" alignItems="center" pb={8}>
                    <Text fontFamily="subheading" fontSize="sm" color="goodGrey.600">
                        {i18n._(t`GoodDapp currently does not support Swap on Ethereum.`)}
                    </Text>
                    <Link
                        fontFamily="subheading"
                        fontSize="sm"
                        isExternal={false}
                        onPress={toggleNetworkModal}
                        _text={{ color: 'primary' }}
                    >
                        {i18n._(t`Please switch your network to Fuse or Celo to Swap.`)}
                    </Link>
                    <HStack space={1}>
                        <Text fontFamily="subheading" fontSize="sm" color="goodGrey.600">
                            {i18n._(
                                t`Click here to learn more about GoodDollar liquidity, including how to provide liquidity.`
                            )}
                        </Text>
                        <Link isExternal _text={{ color: 'primary' }} href="https://docs.gooddollar.org/liquidity">
                            {i18n._(t`Learn more`)}
                        </Link>
                    </HStack>
                </VStack>
            ) : (
                <VStack space={2} textAlign="center" justifyContent="center" alignItems="center" pb={8}>
                    <Text fontFamily="subheading" fontSize="sm" color="goodGrey.600" pt={4} pb={8} textAlign="center">
                        {i18n._(
                            t`On this page, you can convert your digital assets. 
Please be patient, loading information in the Swap widget may take some time. Thanks for waiting!`
                        )}
                    </Text>
                </VStack>
            )}
            {chainConfig.enabled ? chainConfig.component : null}
        </PageLayout>
    )
})

export default Swap

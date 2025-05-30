import {
    BigUIntType,
    BinaryCodec,
    FieldDefinition,
    StructType,
    TokenIdentifierType,
} from '@terradharitri/sdk-core';
import { DcdtTokenPayment } from '../dcdt-token-payment/dcdt.token.payment';
import { WrappedLpTokenAttributesTypeV2 } from './proxy.token.types';

export class WrappedLpTokenAttributesV2 {
    lpTokenID: string;
    lpTokenAmount: string;
    lockedTokens: DcdtTokenPayment;

    constructor(init: WrappedLpTokenAttributesTypeV2) {
        this.lpTokenID = init.lpTokenID;
        this.lpTokenAmount = init.lpTokenAmount;
        this.lockedTokens = new DcdtTokenPayment(init.lockedTokens);
    }

    toJSON(): WrappedLpTokenAttributesTypeV2 {
        return {
            lpTokenID: this.lpTokenID,
            lpTokenAmount: this.lpTokenAmount,
            lockedTokens: this.lockedTokens.toJSON(),
        };
    }

    static fromAttributes(attributes: string): WrappedLpTokenAttributesV2 {
        const attributesBuffer = Buffer.from(attributes, 'base64');
        const codec = new BinaryCodec();
        const structType = this.getStructure();
        const [decoded] = codec.decodeNested(attributesBuffer, structType);
        return this.fromDecodedAttributes(decoded.valueOf());
    }

    static fromDecodedAttributes(
        decodedAttributes: any,
    ): WrappedLpTokenAttributesV2 {
        return new WrappedLpTokenAttributesV2({
            lpTokenID: decodedAttributes.lp_token_id.toString(),
            lpTokenAmount: decodedAttributes.lp_token_amount.toFixed(),
            lockedTokens: DcdtTokenPayment.fromDecodedAttributes(
                decodedAttributes.locked_tokens,
            ),
        });
    }

    static getStructure(): StructType {
        return new StructType('WrappedLpTokenAttributes', [
            new FieldDefinition('lp_token_id', '', new TokenIdentifierType()),
            new FieldDefinition('lp_token_amount', '', new BigUIntType()),
            new FieldDefinition(
                'locked_tokens',
                '',
                DcdtTokenPayment.getStructure(),
            ),
        ]);
    }
}

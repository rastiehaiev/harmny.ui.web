<template>
    <article class="signin-section">
        <div class="signin-container">
            <section class="signin-socials-section">
                <div class="signin-socials-section__brand">
                    <icon-logo/>
                    <h3>Harmony</h3>
                </div>
                <div class="signin-socials-section__description">
                    <h4>Sign in using social media to get quick access</h4>
                </div>
                <div class="signin-socials-section__buttons">
                    <div class="signin-socials-section__button">
                        <w-button @click.prevent="signin('google')" width="100%" height="2.2rem" bg-color="red-light1" color="white">
                            <w-icon>mdi mdi-google</w-icon>
                            Sign in with Google
                        </w-button>
                    </div>
                    <div class="signin-socials-section__button">
                        <w-button @click.prevent="signin('twitter')" disabled width="100%" height="2.2rem" bg-color="cyan-dark1" color="white">
                            <w-icon>mdi mdi-twitter</w-icon>
                            Sign in with Twitter
                        </w-button>
                    </div>
                </div>
            </section>
            <section class="signin-manual-section">
                <header class="signin-manual-section__header">
                    <h3>Sign in to your account</h3>
                    <h4>Don't have an account?
                        <router-link to="/sign-up">Sign up</router-link>
                        <span>!</span>
                    </h4>
                </header>
                <form class="signin-manual-section__login-form">
                    <div>
                        <hy-input input-type="email" input-placeholder="Email"
                                  :disable="this.inputsDisabled"
                                  :modelValue="email"
                                  @update:modelValue="newValue => email = newValue"
                                  @validate="validateEmail"
                                  :error-code="emailInvalidErrorCode"/>
                    </div>
                    <div>
                        <hy-input input-type="password" input-placeholder="Password"
                                  :disable="this.inputsDisabled"
                                  :modelValue="password"
                                  @update:modelValue="newValue => password = newValue"
                                  @validate="validatePassword"
                                  :error-code="passwordInvalidErrorCode"/>
                    </div>
                    <div class="signin-manual-section__additional-actions">
                        <a href="#">Forgot password?</a>
                    </div>
                    <div>
                        <hy-input-submit @click.prevent="signin('local')" type="submit" value="Sign in"></hy-input-submit>
                    </div>
                    <div v-if="!!currentSignInError" class="signin-manual-section__current_error">
                        <h4>{{ currentSignInError }}</h4>
                    </div>
                </form>
            </section>
        </div>
    </article>
</template>

<script>
import IconLogo from "@/components/basic/icons/IconLogo.vue";
import HyInput from "@/components/basic/elements/HyInput.vue";
import HyInputSubmit from "@/components/basic/elements/HyInputSubmit.vue";

import authService from "@/services/auth-service.js";
import validationService from "@/services/validation-service.js";
import configProvider from "@/utils/config-provider.js";
import messageResolver from "@/utils/message-resolver";

export default {
    components: {IconLogo, HyInput, HyInputSubmit},
    data() {
        return {
            email: '',
            password: '',
            emailInvalidErrorCode: undefined,
            passwordInvalidErrorCode: undefined,
            inputsDisabled: false,
            currentSignInError: undefined,
        }
    },
    methods: {
        signin(provider) {
            if (provider === 'local') {
                this.validateEmail(this.email);
                this.validatePassword(this.password);
                if (!this.submitDisabled) {
                    this.inputsDisabled = true;
                    authService.signin(this.email, this.password)
                           .then(tokenResponse => {
                               const {token, 'refresh-token': refreshToken} = tokenResponse;
                               if (token) {
                                   localStorage.setItem('token', token);
                               }
                               if (refreshToken) {
                                   localStorage.setItem('refresh-token', refreshToken);
                               }
                               this.inputsDisabled = false;
                           })
                           .catch(error => {
                               const failureType = error.response.data?.failure?.type;
                               if (failureType) {
                                   const message = messageResolver.resolveByCode(failureType);
                                   if (message) {
                                       this.currentSignInError = message;
                                   }
                               }
                               this.inputsDisabled = false;
                           });
                }
            } else {
                const {serviceUserBaseUrl, uiBaseUrl} = configProvider;
                window.location.href = `${serviceUserBaseUrl}/oauth2/authorize/${provider}?redirect_uri=${uiBaseUrl}/sign-in`;
            }
        },
        validateEmail(email) {
            this.emailInvalidErrorCode = validationService.validateEmail(email);
        },
        validatePassword(password) {
            this.passwordInvalidErrorCode = validationService.validatePassword(password);
        },
    },
    computed: {
        submitDisabled() {
            return this.emailInvalidErrorCode || this.passwordInvalidErrorCode;
        },
    },
    mounted() {
        const refreshToken = this.$route.query['refresh-token'];
        if (refreshToken) {
            localStorage.setItem('refresh-token', refreshToken);
        }
        const token = this.$route.query.token;
        if (token) {
            localStorage.setItem('token', token);
            this.$router.push({path: '/'})
        }
    },
};
</script>

<style scoped>

.signin-section {
    background-color: rgba(15, 200, 231, 0.15);
    height: 100%;
    display: flex;
    justify-content: center;
}

.signin-container {
    display: flex;
    flex-direction: column;
}

.signin-container h3 {
    font-size: 2rem;
    font-weight: 400;
}

.signin-container h4 {
    font-size: 0.9rem;
}

.signin-socials-section, .signin-manual-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    gap: 2rem;
}

.signin-socials-section {
    padding: 3.2rem;
    color: white;
    background-color: rgb(16, 109, 164);
}

.signin-socials-section > * {
    width: 100%;
}

.signin-socials-section__buttons {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.signin-socials-section__button {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.signin-socials-section__button button {
    flex-grow: 100;
    height: 2rem;
    display: flex;
    gap: 1rem;
}

.signin-socials-section__brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.signin-socials-section__brand h3 {
    font-weight: 500;
}

.signin-socials-section__brand svg {
    height: 2rem;
    width: 2rem;
}

.signin-socials-section__description h4 {
    font-weight: 400;
}

.signin-manual-section {
    padding: 2.4rem;
    background-color: white;
}

.signin-manual-section a {
    color: var(--color-link)
}

.signin-manual-section a:hover {
    color: var(--color-link-hover)
}

.signin-manual-section__header {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    text-align: center;
}

.signin-manual-section__login-form {
    display: flex;
    flex-direction: column;
    width: 88%;
    gap: 1rem;
}

.signin-manual-section__additional-actions {
    text-align: right;
    font-size: 0.9rem;
}

.signin-manual-section__current_error h4 {
    color: var(--color-red-2);
}

@media only screen and (min-width: 90rem) {
    .signin-container {
        width: 50%;
        flex-direction: row;
    }

    .signin-section {
      align-items: center;
    }

    .signin-socials-section {
        width: 42%;
    }

    .signin-manual-section {
        width: 58%;
        padding: 4rem;
    }
}

</style>
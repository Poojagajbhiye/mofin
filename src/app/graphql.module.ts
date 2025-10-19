import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { inject, NgModule, Query } from '@angular/core';
import { ApolloClientOptions, ApolloLink, InMemoryCache } from '@apollo/client/core';
import { environment } from '../environments/environment.development';
import { setContext } from '@apollo/client/link/context';
import { offsetLimitPagination } from '@apollo/client/utilities';
import { ToastService } from './core/services/toast.service';
import { onError } from '@apollo/client/link/error';

export function createApollo(): ApolloClientOptions<any> {
  const uri = environment.apiUrl;
  const httpLink = inject(HttpLink);
  const toastService: ToastService = inject(ToastService);

  const auth: ApolloLink = setContext((operation, context) => {
    return {
      headers: {
        Auth: 'test'
      }
    };
  });

  const errorLink: ApolloLink = onError(({operation, response, graphQLErrors, networkError}) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, extensions }) => {
        console.log('[GraphQL error]', message);
      });

      const message = graphQLErrors[0].message;
      toastService.showError(`GraphQL server: ${message}`);
    }

    if (networkError) {
      console.log('[Network error]', networkError.message);

      const message = networkError.message;
      toastService.showError(`Network: ${message}`);
    }
  });

  return {
    link: ApolloLink.from([errorLink, auth, httpLink.create({uri})]),
    cache: new InMemoryCache({
      addTypename: true,
      resultCaching: true,
      typePolicies: {
        Query: {
          fields: {
            allPosts: offsetLimitPagination()
          }
        }
      }
    }),
  };
}

@NgModule({
  providers: [provideApollo(createApollo, {useInitialLoading: true})],
})
export class GraphQLModule {}
